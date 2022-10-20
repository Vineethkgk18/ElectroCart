
  function billingAddress(addId) {
    console.log(addId);
    console.log("AAAAAAAAABBBBBBBXBBBBBXXXX")
    $.ajax({
      url:'/billingAddress',
      data:{
        address:addId
    },
      method: 'post',
      success: (res) => {
        console.log("WWWWWWWWWWWWWWWW")
        console.log("this is from response", res);
        //alert('success')
          document.getElementById("Name").value = res.address.Name;
          document.getElementById("email").value = res.address.Email;
          document.getElementById("phoneNumber").value = res.address.mobile;
          document.getElementById("address").value = res.address.Address;
        // // document.getElementById("lastName").value = res.address.lastName;
          document.getElementById("pincode").value = res.address.Pincode;
        // document.getElementById("city").value = res.address.city;
        // document.getElementById("landmark").value = res.address.landmark;
        // document.getElementById("state").value = res.address.state;
      },
      error: (error) => {
        alert('Error')
        console.log(error)
      },
    })
  }


  function confirmOrderButton(){
    Name = document.getElementById("Name").value
    mobile = document.getElementById("phoneNumber").value
    Email = document.getElementById("email").value
    Address = document.getElementById("address").value
    Pincode = document.getElementById("pincode").value
    paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    // lastName = document.getElementById("lastName").value

    $.ajax({
      url:'/confirmOrder',
      data:{
        Name:Name,
        mobile:mobile,
        Email:Email,
        Address:Address,
        Pincode:Pincode,
        paymentMethod:paymentMethod
      },
      method:'post',
      success:(response)=>{
        alert("Order Successful")
        if(response.status){
          location.href='/orderSuccess'
        }
        else{
           
        }
      }
    })
  }



$("#checkOutPayment").submit( (e)=>{
  e.preventDefault()
  $ajax({
    url:'/confirmOrder',
    method:'post',
    data:$('#checkOutPayment').serialize(),
    success:(response)=>{
      alert(response)
    }
  })
})


