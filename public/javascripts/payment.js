//require('dotenv').config();
//const YOUR_KEY_ID=process.env.RAZOR_KEY_ID

  function billingAddress(addId) {
    
    $.ajax({
      url:'/billingAddress',
      data:{
        address:addId
    },
      method: 'post',
      success: (res) => {
        /*  response object return the date from the backend and here the 
            data recieved in res is send to the fronded using dom  
        
        */
          document.getElementById("Name").value = res.address.Name;
          document.getElementById("email").value = res.address.Email;
          document.getElementById("phoneNumber").value = res.address.mobile;
          document.getElementById("address").value = res.address.Address;
        // // document.getElementById("lastName").value = res.address.lastName;
          document.getElementById("pincode").value = res.address.Pincode;
      },
      error: (error) => {
        alert('Error')
        console.log(error)
      },
    })
  }


  function applyCoupon(couponId,couponName,DiscountAmount,totalPrice) {
    /*
  this function get the applied coupon details, couponId
  couponName and DiscountAmount and send it to beckend via 
  url: ''/applyCoupon'
  
  */ 
 console.log("ZZZZZZZZZZZZZZZZZZz ")
 //console.log("totalPrice:",totalPrice)
    // alert(couponId)
    //console.log
    //alert(totalPrice)
    document.getElementById('placeId').value = couponName;
    document.getElementById('discount').innerHTML = DiscountAmount;
    $.ajax({
          url:'/applyCoupon',
          data:{
            couponId:couponId,
            couponName:couponName,
            totalPrice:totalPrice
          },
          method:'post',
          success:(response)=>{
            console.log("totalPrice:",response.couponData.totalPrice)
              if(response.couponData.expiry)
              {
                console.log("coupon has expired")
                alert('coupon has expired')
                document.getElementById('discount').innerHTML = 0;

              }else if(response.couponData.couponUsed){
                alert('this coupon is already used')
                document.getElementById('discount').innerHTML = 0;
              }else if(response.couponData.unavailable)
              {
                alert('this coupon is not available')
                document.getElementById('discount').innerHTML = 0;
              }else
              {
                  console.log("response:", response)
                 document.getElementById('discount').innerHTML = DiscountAmount;
                 document.getElementById('discount').innerHTML = response.couponData.totalPrice-DiscountAmount;

              }
            //alert("America Success");
          }
    })
  }

//  function redeem(totalPrice){
//     $.ajax({
//       url:'/redeemCoupon',
//       data:{
//         totalPrice: totalPrice
//       },
//       method:'post',
//       success:(res)=>{
//         alert("coupon applied")
//       }
//     })
//  }


  function confirmOrderButton(){
    ///e.preventDefault()
    /*
    
    *
     */
    Name = document.getElementById("Name").value
    mobile = document.getElementById("phoneNumber").value
    Email = document.getElementById("email").value
    Address = document.getElementById("address").value
    Pincode = document.getElementById("pincode").value
    paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    amount = document.getElementById("grantTotal").value  
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
        if(response.codSuccess){
          alert("Order Successful")
          location.href='/orderSuccess'
        }
        else{
          console.log("hay i am here")
          console.log("XXXX__amount",amount)
          response.amount= amount; 
           razorpayPayment(response)
        }
      }
    })
  }

function razorpayPayment(order){
  console.log("ZZZZZZZZ order  order:",order)
  console.log("order.amount:", order.response.amount)
  var options = {
    
    "key":"rzp_test_3VrbJtZm0Ok6hL",
    //"key":YOUR_KEY_ID, // Enter the Key ID generated from the Dashboard
    "amount": parseInt(order.response.amount) * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    // "amount": 40000,
    "currency": "INR",
    "name": "ElectroCart",
    "description": "Test Transaction",
    "image": "https://example.com/your_logo",
    "order_id": order.response.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
    "handler": function(response){
      verifyPayment(response,order)
    },
    "prefill": {
        "name": "Gaurav Kumar",
        "email": "gaurav.kumar@example.com",
        "contact": "9999999999"
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    }
};
var rzp1 = new Razorpay(options);
    rzp1.open();
}

function verifyPayment(payment,order){
  
  $.ajax({
    url:'/verifyPayment',
    method:'post',
    data:{
      payment,
      order
    },
    success:(response)=>{
      if(response.status){
        alert("Order Successful")
        location.href='/orderSuccess'
      }else{
        alert("Payment failed")
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


