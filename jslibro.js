let elnumero = Number(prompt("Elije un numero"));

if (!Number.isNaN(elnumero)){
    console.log("Tu numero es la raiz cuadrada de " + elnumero * elnumero);
}else if (elnumero < 12){
    console.log("mediano")
}else{
    console.log("grande")
}

let n = 0;
while (n <= 10){
    console.log(n);
    n = n+2;
}

let tunombre;
do{
    tunombre = prompt("Quien eres?");
}while(!tunombre);
    console.log(tunombre);