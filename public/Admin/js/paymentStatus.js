function myStatus(orderId){
    console.log(orderId)
    if(document.getElementById("bstatus").innerHTML){
        //console.log(document.getElementById("bstatus").innerHTML)
        //alert(document.getElementById("bstatus").innerHTML)
        document.getElementById("pstatus").innerHTML='shipped';
    }
    //alert('Button was clicked!');
}