       		function addToCart(proId){
			$.ajax({
				url:'/addToCart/'+proId,
				method:'get',
				success:(response)=>{
					if(response.status){
						let count=$('#cartCount').html()
						count=parseInt(count)+1
						$("#cartCount").html(count)
					}
					alert("Product Added to cart")
				}
			})
		}

		function addToWishList(proId){
			$.ajax({
				url:'/addToWishList/'+proId,
				method:'get',
				success:(response)=>{
					if(response.status){
						let w_count=$('#wishListCount').html()
						w_count=parseInt(w_count)+1
						$("#wishListCount").html(w_count)
					}
					alert("Product Added to Wishlist")
				}				
			})
		}
