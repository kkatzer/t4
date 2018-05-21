var grade;
var aluno;
var tam_opt=0;
var tg1;
var tg2;

$(document).ready(function() {
  grade = document.getElementById("grade");
  grade.addEventListener('mousedown', clicou, false);
  document.getElementById("ver_grade").addEventListener('mousedown', verifica, false);
  document.getElementById("ver_grade").addEventListener('keypress', tecla, false);
  document.getElementById("matricula").addEventListener('keypress', tecla, false);
  verifica();
});
function tecla(event){
  var e = event || window.event;
  if (event.keyCode==13){
    verifica();
  }
}
function verifica(event){
  var e = event || window.event;
  var ok=1;
  var grr = document.getElementById("matricula").value;
  $.get("alunos.xml", function(data){
    var alunos = $(data).find('ALUNOS_CURSO').children();
    this.qtd = alunos.length;
    $.each(alunos, function (index, value) {
      var $aluno = $(value);
      if ($aluno.find('MATR_ALUNO').text()==grr){
        var txt = "<p>";
        txt += $aluno.find('NOME_ALUNO').text()+"<br>";
        txt += $aluno.find('NOME_CURSO').text()+"Versão de "+$aluno.find('NUM_VERSAO').text()+"<br>";
        txt += "</p>";
        document.getElementById("info").innerHTML = txt;
        ok=0;
        return false;
      }
    })
    document.getElementById("infops").style.visibility = "hidden";
    document.getElementById("infops").innerHTML = ""
    if (ok==0){
      tg1 = undefined;
      tg2 = undefined;
      carrega_grade();
      document.getElementById("legenda").style.visibility = "visible";
      document.getElementById("infops").style.visibility = "visible";
    }else{
      document.getElementById("info").innerHTML = "<p>GRR nao existe na base.</p>"
      document.getElementById("grade").innerHTML = "";
      document.getElementById("legenda").style.visibility = "hidden";
    }

  });
}

function clicou(event){
  var e = event || window.event;
  switch (e.which) {
    case 1://bt esquerdo
    carrega_situacao(event.target.id);
    break;
    case 3://bt direito
    carrega_historico(event.target.id);
    break;
  }
}

function carrega_grade(){
  var tipo;
  aluno = document.getElementById("matricula").value;
  var cont;
  $.get("alunos.xml", function(data){
    var alunos = $(data).find('ALUNOS_CURSO').children();
    cont=0;
    $.each(alunos, function (index, value) {
      var $aluno = $(value);
      if ($aluno.find('MATR_ALUNO').text()==aluno){
        console.log(index);
        if (cont==0){
          if ($aluno.find('ID_VERSAO_CURSO').text()=="308"){
            $( "#grade" ).load( "grade_antiga.html", function() {
              tam_opt=9;
              pinta_materias();

            });
          }else if ($aluno.find('ID_VERSAO_CURSO').text()=="1227"){
            $( "#grade" ).load( "grade_nova.html", function() {
              tam_opt=6;
              pinta_materias();
            });
          }
          cont+=1;
          return false;
        }
      }
    });
  });
  return tipo;
}

var optativas=[];
var desc_optativas=[];
var ultima_optativas=[];
var situacao_optativas=[];
function pinta_materias(){
  aluno = document.getElementById("matricula").value;
  $.get("alunos.xml", function(data){
    var alunos = $(data).find('ALUNOS_CURSO').children();
    var cont=0;
    var cont_opt=0;
    optativas=[];
    desc_optativas=[];
    situacao_optativas=[];
    ultima_optativas=[];
    $.each(alunos, function (index, value) {
      var $aluno = $(value);
      if ($aluno.find('MATR_ALUNO').text()==aluno){
        var cor="";
        switch ($aluno.find('SITUACAO_ITEM').text()){
          case "1" :
          case "4" : //aprovado
          cor=" #89C35C";
          break;
          case "2" :
          case "3" :
          case "9" ://reprovado
          cor="#DC381F";
          break;
          case "5": //cancelado
          cor= "#893BFF";
          break;
          case "10": //matricula
          cor="#79BAEC";
          break;
          case "11": //equivalencia
          cor="#FDD017";
          break;
          case "12": //trancamento
          cor= "#F9B7FF";
          break;
          default: //trancamento administrativo
          break;
        }

        if ($aluno.find('ID_ESTRUTURA_CUR').text()=="1744") { //eh optativa
          if (optativas.indexOf($aluno.find('COD_ATIV_CURRIC').text())!=-1){//tem
            var ind = optativas.indexOf($aluno.find('COD_ATIV_CURRIC').text());
            var nome = "OPT" + parseInt(optativas.indexOf($aluno.find('COD_ATIV_CURRIC').text()))+1;
            var texto =  "Cursado em: " + $aluno.find('PERIODO').text() + " de " + $aluno.find('ANO').text() + "\n";
            texto = texto +  "Média Final: "+parseFloat($aluno.find('MEDIA_FINAL').text()).toFixed(2)+ "\n";
            texto = texto +  "Frequência: "+ parseFloat($aluno.find('FREQUENCIA').text()).toFixed(2)+ "\n";
            texto = texto +  "Situação: "+ $aluno.find('SIGLA').text() + "\n\n";
            ultima_optativas[ind] = texto;
            desc_optativas[ind] = desc_optativas[ind] + texto;
            situacao_optativas[ind] = cor;
          }else{//nao tem
            if (optativas.length<tam_opt){ //adc
              optativas.push($aluno.find('COD_ATIV_CURRIC').text());
              var texto = "Optativa "+$aluno.find('COD_ATIV_CURRIC').text()+" - "+$aluno.find('NOME_ATIV_CURRIC').text()+"\n\n";
              var texto =  "Cursado em: " + $aluno.find('PERIODO').text() + " de " + $aluno.find('ANO').text() + "\n";
              texto = texto +  "Média Final: "+parseFloat($aluno.find('MEDIA_FINAL').text()).toFixed(2)+ "\n";
              texto = texto +  "Frequência: "+ parseFloat($aluno.find('FREQUENCIA').text()).toFixed(2)+ "\n";
              texto = texto +  "Situação: "+ $aluno.find('SIGLA').text() + "\n\n";
              desc_optativas.push(texto);
              ultima_optativas.push(texto);
              situacao_optativas.push(cor);
            }else{ //vai ter que remover mais antiga
              var qtd = optativas.length;
              for (ind = 0; ind < qtd; ind++){
                if (situacao_optativas[ind]!="green"){
                  var texto = "Optativa "+$aluno.find('COD_ATIV_CURRIC').text()+" - "+$aluno.find('NOME_ATIV_CURRIC').text()+"\n\n";
                  var texto =  "Cursado em: " + $aluno.find('PERIODO').text() + " de " + $aluno.find('ANO').text() + "\n";
                  texto = texto +  "Média Final: "+parseFloat($aluno.find('MEDIA_FINAL').text()).toFixed(2)+ "\n";
                  texto = texto +  "Frequência: "+ parseFloat($aluno.find('FREQUENCIA').text()).toFixed(2)+ "\n";
                  texto = texto +  "Situação: "+ $aluno.find('SIGLA').text() + "\n\n";
                  optativas[ind] = $aluno.find('COD_ATIV_CURRIC').text();
                  desc_optativas[ind] = texto;
                  ultima_optativas[ind] = texto;
                  situacao_optativas[ind] = cor;
                  return false;
                }
              }
            }

          }

        }
        //TODO
        if (data.ALUNO[i].SITUACAO_ITEM=="12" && data.ALUNO[i].COD_ATIV_CURRIC=="TRT001"){ //trancamento
          console.log("trancamento: "+data.ALUNO[i].COD_ATIV_CURRIC+" - "+data.ALUNO[i].NOME_ATIV_CURRIC);
          var html = document.getElementById("infops").innerHTML;
          if (html==""){
            html = "obs.: "+data.ALUNO[i].NOME_ALUNO+" trancou o curso em: <br>";
          }
          html += data.ALUNO[i].PERIODO + " de " + data.ALUNO[i].ANO + "<br>";
          document.getElementById("infops").innerHTML=html;
        }

        if (data.ALUNO[i].ID_ESTRUTURA_CUR=="1741" || data.ALUNO[i].ID_ESTRUTURA_CUR=="7406"){ //obrigatorias
          if (data.ALUNO[i].SITUACAO_ITEM=="11"){ // equivalencia nao tem na grade
            console.log("equivalencia: "+data.ALUNO[i].COD_ATIV_CURRIC+" - "+data.ALUNO[i].NOME_ATIV_CURRIC);
          }
          else{
            document.getElementById(data.ALUNO[i].COD_ATIV_CURRIC).style.backgroundColor = cor;
            document.getElementById(data.ALUNO[i].COD_ATIV_CURRIC).style.color = "black";
          }

        }
        else if (data.ALUNO[i].ID_ESTRUTURA_CUR=="1742"){ //tg1
          if (tg1==undefined)
          tg1 = {nome:data.ALUNO[i].COD_ATIV_CURRIC, historico:"", ultimo:""};
          var texto =  "Cursado em: " + data.ALUNO[i].PERIODO + " de " + data.ALUNO[i].ANO + "\n";
          texto = texto +  "Média Final: "+parseFloat(data.ALUNO[i].MEDIA_FINAL).toFixed(2)+ "\n";
          texto = texto +  "Frequência: "+ parseFloat(data.ALUNO[i].FREQUENCIA).toFixed(2)+ "\n";
          texto = texto +  "Situação: "+ data.ALUNO[i].SIGLA + "\n\n";
          tg1.historico += texto;
          tg1.ultimo = texto;
          document.getElementById("TGI").style.backgroundColor = cor;
          document.getElementById("TGI").style.color = "black";
        }
        else if (data.ALUNO[i].ID_ESTRUTURA_CUR=="1743"){ //tg2
          if (tg2==undefined)
          tg2 = {nome:data.ALUNO[i].COD_ATIV_CURRIC, historico:"", ultimo:""};
          var texto =  "Cursado em: " + data.ALUNO[i].PERIODO + " de " + data.ALUNO[i].ANO + "\n";
          texto = texto +  "Média Final: "+parseFloat(data.ALUNO[i].MEDIA_FINAL).toFixed(2)+ "\n";
          texto = texto +  "Frequência: "+ parseFloat(data.ALUNO[i].FREQUENCIA).toFixed(2)+ "\n";
          texto = texto +  "Situação: "+ data.ALUNO[i].SIGLA + "\n\n";
          tg2.historico += texto;
          tg2.ultimo = texto;
          document.getElementById("TGII").style.backgroundColor = cor;
          document.getElementById("TGII").style.color = "black";
        }
      }
    }
    for (i=0; i<optativas.length; i++){
      document.getElementById("OPT"+(i+1)).style.backgroundColor = situacao_optativas[i];
      document.getElementById("OPT"+(i+1)).style.color = "black";
    }
  });
}

function carrega_historico(materia){
  aluno = document.getElementById("matricula").value;
  var texto;

  if (materia.indexOf("OPT")!=-1){
    texto = desc_optativas[materia.charAt(3)-1];
    if (texto!=undefined)
    alert("Histórico de "+materia+"\n"+texto);
    else
    alert("Não existem dados para disciplina selecionada.");
  }else if(materia=="TGI"){
    if (tg1!=undefined)
    alert("Histórico de TG1\n"+tg1.historico);
    else
    alert("Não existem dados para disciplina selecionada.");
  }else if(materia=="TGII"){
    if (tg2!=undefined)
    alert("Histórico de TG2\n"+tg2.historico);
    else
    alert("Não existem dados para disciplina selecionada.");
  }else{
    $.getJSON( "http://www.inf.ufpr.br/bmuller/CI320/7/alunos.json", function(data){
      this.qtd = data.ALUNO.length;
      var cont=0;
      texto="Histórico "+materia;
      for (i = 0; i < this.qtd; i++){
        if (data.ALUNO[i].MATR_ALUNO==aluno && data.ALUNO[i].COD_ATIV_CURRIC==materia ){
          if (cont==0){
            texto = texto + " - "+data.ALUNO[i].NOME_ATIV_CURRIC+":\n\n";
          }
          texto = texto +  "Cursado em: " + data.ALUNO[i].PERIODO + " de " + data.ALUNO[i].ANO + "\n";
          texto = texto +  "Média Final: "+parseFloat(data.ALUNO[i].MEDIA_FINAL).toFixed(2)+ "\n";
          texto = texto +  "Frequência: "+ parseFloat(data.ALUNO[i].FREQUENCIA).toFixed(2)+ "\n";
          texto = texto +  "Situação: "+ data.ALUNO[i].SIGLA + "\n\n";
          cont=1;
        }
      }
      if (texto!="Histórico "+materia)
      alert(texto);
      else
      alert("Não existe histórico para disciplina selecionada.");
    });
  }
}

function carrega_situacao(materia){
  aluno = document.getElementById("matricula").value;
  var texto;
  if (materia.indexOf("OPT")!=-1){
    texto = ultima_optativas[materia.charAt(3)-1];
    if (texto!=undefined)
    alert(texto);
    else
    alert("Não existem dados para disciplina selecionada.");
  }else if(materia=="TGI"){
    if (tg1!=undefined)
    alert("Situação de TG1\n"+tg1.ultimo);
    else
    alert("Não existem dados para disciplina selecionada.");
  }else if(materia=="TGII"){
    if (tg2!=undefined)
    alert("Situação de TG2\n"+tg2.ultimo);
    else
    alert("Não existem dados para disciplina selecionada.");
  }else{
    $.getJSON( "http://www.inf.ufpr.br/bmuller/CI320/7/alunos.json", function(data){
      this.qtd = data.ALUNO.length;
      var cont=0;
      for (i = 0; i < this.qtd; i++){
        if (data.ALUNO[i].MATR_ALUNO==aluno && data.ALUNO[i].COD_ATIV_CURRIC==materia){
          texto = "Situação "+materia+" - "+data.ALUNO[i].NOME_ATIV_CURRIC+":\n\n";
          texto = texto +  "Cursado em: " + data.ALUNO[i].PERIODO + " de " + data.ALUNO[i].ANO + "\n";
          texto = texto +  "Média Final: "+parseFloat(data.ALUNO[i].MEDIA_FINAL).toFixed(2)+ "\n";
          texto = texto +  "Frequência: "+ parseFloat(data.ALUNO[i].FREQUENCIA).toFixed(2)+ "\n";
          texto = texto +  "Situação: "+ data.ALUNO[i].SIGLA + "\n\n";
          cont=1;
        }
      }
      if (texto!=undefined)
      alert(texto);
      else
      alert("Não existem dados para disciplina selecionada.");
    });
  }
}
