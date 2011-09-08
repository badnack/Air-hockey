
//se si sta usando internet explorer
var IExplorer = document.all?true:false

//Variabili per il campo
var wally;
var wallx;

//Variabili racchetta giocatore 1
var p1Top ;
var p1;
var p1Bot ;
var p1h;

//Variabili racchetta giocatore 2
var p2;
var p2Top = 100;
var p2Bot = 150;

//variabili dischetto
var Ball;
var BallX=0;
var BallY=0;

//direzione iniziale di default
var dirX=0;
var dirY=0;
//sinistra=0 destra=1
//su=0 giu=1

//variabili controllo punteggio
//difficolta e punteggio
var diff=1;
var PunP1=0;
var PunP2=0;
var pallino=0;
//serve per la funzione start
var press=0;
//serve per la pratica
var prat=0;

//variabile per incrementare gradualmente la velocità della pallina
var inc=0;
//la variabile pausa viene settata quando il gioco viene messo in pausa
var pause=0;
//tot indica il numero di partite fatte nel campionato (al massimo sono 3)
var tot=0;

//ogni volta che la finestra viene ridotta o ingrandita faccio il resize degli oggetti
function resize(){
  // metto le grandezze importanti dentro variabili
  //Il campo
  wally=(document.body.clientHeight/100)*80;
  wallx=(document.body.clientWidth/100)*85;
  //l'altezza delle racchette
  p1h=(document.body.clientHeight/100)*24;

}

//funzione per muovere le racchette
function moveR(e)
{ 
   if(IExplorer)
   {
      p1Mid = event.clientY + document.body.scrollTop;

   }else{
	//catturo posizione Y del mouse
      var tempMouseY = e.pageY;
      if(tempMouseY < 0)
         tempMouseY = 0;
     //setto al posizione del mouse come metà della racchetta per una
     //questione grafica
      p1Mid = tempMouseY;
   }
   //sistemo i limiti superiore e inferiore rispetto al punto medio della barra
   if(p1Mid<=p1h/2)p1Mid=p1h/2;
   if(p1Mid>=(wally-p1h/2))p1Mid=wally-p1h/2;	

   //la punta della racchetta superiore	
   p1Top = p1Mid - p1h/2;	
   //la punta inferiore
   p1Bot = p1Top + p1h;
   //refresh delle racchette
   p1.style.top = p1Top + 'px';
}

//inizializza la schermata
//ed i valori di partenza
function init (){
	p1=document.getElementById("rsinistra");	
        p2=document.getElementById("rdestra");
	Ball=document.getElementById("ball");

	//mi salvo la grandezza della racchetta
	resize();
	//prendo le opzioni settate
	opt=location.search;
	//in caso di pratica setto prat a 1 e il pallino al giocatore 1
	if(opt=="?id=7"){pallino=0;prat=1;}
	if(opt=="?id=0" || opt=="?id=3")diff=0;
	if(opt=="?id=1" || opt=="?id=4")diff=1;
	if(opt=="?id=2" || opt=="?id=5")diff=2;
	if(opt=="?id=3" || opt=="?id=4" || opt=="?id=5")document.getElementById("rsinistra").style.background="green";

	//pallino casuale
	pallino=Math.floor(Math.random()*2);

	//se pari la pallina è del giocatore
	if(pallino==0)BallX=30;
	else BallX=(wallx-30);
	BallY=(wally/2);
	
	//punto di partenza della seconda racchetta
	p2.style.background="grey";
	document.getElementById("P1Pun").value="P1: 0";
        document.getElementById("P2Pun").value="P2: 0";
}



function SetLvl(pwin){
	//azzero i punteggi;
	PunP1=0;
	PunP2=0;
	tot+=1;//incremento il numero delle partite fatte
	document.getElementById("P2Pun").value="P2: "+ PunP2;
	document.getElementById("P1Pun").value="P1: "+ PunP1;
	
	//se l'utente vuole o deve ricominciare da capo
	if(pwin==false){
			//setto la difficolta normale
			diff=1;
			//e colore racchetta avversario grigia
			p2.style.background="grey";
			tot=0;
			return;
	}

	//setto i paramentri per il livello successivo
	if(tot<3){if(diff<3)diff++;}
	//gioco terminato
	else {
		alert("Gioco finito: complimenti");
		diff=1;
		tot=0;
		location.href='winner.html';
		
	}
	//cambio colore alla racchetta avversaria
	if(diff==0)p2.style.background="white";
	if(diff==1)p2.style.background="grey";
	if(diff==2)p2.style.background="green";
	if(diff==3)p2.style.background="red";
	
	return;
	
}

function SetAngle(){

	//dirX==1 si muove verso sinistra
	if(dirX==1)BallX=BallX-(15+inc);
	if(dirX==1.5)BallX=BallX-(15+inc);
	
	//dirX==0 si muove verso destra
	if(dirX==0)BallX=BallX+(15+inc);
	if(dirX==0.5)BallX=BallX+(10+inc);

	//controlla flusso verticale
	//10px sono la metà dell'altezza della pallina  
	if(BallY>=(wally-10))dirY=0;
	if(BallY<=0)dirY=1;
	
	//dirY==0 va su
	if(dirY==0)BallY=BallY-(15+inc);
	if(dirY==0.5)BallY=BallY-(15+inc);

	//dirY==1 va giu
	if(dirY==1)BallY=BallY+(10+inc);
	if(dirY==1.5)BallY=BallY+(5+inc);
	//imprimo il movimento alla pallina
	Ball.style.left=BallX + 'px';
	Ball.style.top=BallY + 'px';
	

}

function moveball(){
	var seg;
	if(pause==1){choose=confirm("Continuare?");if(choose==false)location.href='index.html'; else pause=0;}

	//CONTROLLI GIOCATORE
	
	//PARTE CPU
	if(BallX>=(wallx-(30+inc))){

		//divido la racchetta avversara in due parti cose da imprimere due diversi angoli
		if(BallY>=p2Top && BallY<=(p2Bot/2)){dirX=1.5;dirY=0.5;}
		else if(BallY>=p2Top && BallY<=p2Bot)dirX=1;

		//se il giocatore due non prende la palla
		else if(BallX>=(wallx-5)){
			alert("Giocatore due perde palla, premere ok per continuare");
			PunP1++;
			document.getElementById('P1Pun').value="P1: "+ PunP1;
			if(PunP1==5){
				alert("Partita finita, giocatore 1 vince! Premere ok per continuare");
				SetLvl(true)
			}
			//batte la cpu		
			BallX=wallx;
			BallY=(wally/2);
			inc=0;
			dirX=1;
		}
	}
	
	//PARTE USER
	if(BallX<=15+inc){
			//registro la lunghezza del segmento
			seg=(p1Bot-p1Top);

			//divido la racchetta in 3 segmenti ognuno dei quali imprime un angolo diverso alla pallina
			if((BallY>=p1Top) && (BallY<=p1Bot-(2*(seg/3)))){dirX=0.5;dirY=0.5;}/*primo pezzo di segmento*/
			else if((BallY>=p1Top+(seg/3)) && (BallY<=p1Bot-(seg/3))){dirX=0;dirY=1.5;} /*secondo pezzo*/
			else if((BallY>=p1Top+(2*seg/3)) && (BallY<=p1Bot)){dirX=0;dirY=1;}/*terzo pezzo di segmento*/
			
			else if(BallX<=0){
				alert("Giocatore 1 perde palla, premere ok per continuare");
				PunP2++;
				document.getElementById('P2Pun').value="P1: "+ PunP2;
				//chiedere conferma nuova partita
				if(PunP2==5){
					rep=confirm("Partita finita, giocatore 2 vince! Iniziare di nuovo ?");
					if(rep==false)location.href='index.html';
					SetLvl(false);
				}
				//batte il giocatore
				BallX=17;
				BallY=p1Top+(seg/2);
				//setto cosi inc perche dopo viene aumentato
				inc=-2;
				dirX=0;
			}
			aumenta();

		}
	
	//setto l'angolo della pallina a seconda di dove la colpisce la racchetta
	SetAngle();
	
	//CONTROLLI CPU per la difficoltà
	
	//AI
	//diff: 0 easy, 1 normal 2 hard
	//controllo la velocita della racchetta della cpu a seconda della difficolta
	
	//se il giocatore sta facendo pratica la cpu non sbaglierà mai
	//cerco di prendere il dischetto con la metà della racchetta, cercando cosi di 
	//evitare situazioni di stallo
	if(prat==1){p2Top=BallY;-p1h/2;}
	//altrimenti do una velocità alla racchetta avversaria diversa a seconda della velocità
	else{	
		if(p2Top<BallY){if(diff==0)p2Top+=7.5;if(diff==1)p2Top+=10.5;if(diff==2)p2Top+=11.5;if(diff==3)p2Top+=14;}
		else {if(diff==0)p2Top-=7.5;if(diff==1)p2Top-=10.5;if(diff==2)p2Top-=11.5;if(diff==3)p2Top-=14;}
	}

	p2Bot = p2Top + p1h;

	if(p2Top<=0)p2Top=0;
	//se la racchetta della cpu è in fondo si ferma
 	if(p2Bot > wally)p2Top = wally-p1h;
	p2.style.top= p2Top + 'px';

	//richiamo ricorsivamente la funzione
	setTimeout("moveball()", 50);
	
}

//uso la funzione di appoggio start altrimenti premendo piu volte sul pulsante start richiamerei piu volte la moveball
function start(){
	if(press==1)return;
	press=1;
	if(pallino==0)alert("Pallino per Giocatore 1");
	else {alert("Pallino per l'avversario");dirX=1;}
	moveball();
}
function aumenta(){
	if(inc<20)inc+=1.3;
}
document.onmousemove = moveR;
window.onresize=resize;


