  function create_model() {
		// alert("create")
		var productModel = get_model();
		if (!productModel) {
			var productModel = Rho.ORM.addModel(function(model) {
				model.modelName("Product");
				model.enable("sync");
				model.property("name", "string");
				model.property("brand", "string");
				model.property("price", "float");
				model.set("partition", "user");
			});
		}
		return productModel;
	}

	function get_model() {
		// alert("get_model")
		var productModel = Rho.ORM.getModel("Product");
		// alert(productModel)
		return productModel;
	}

	function if_model_exists(callback) {
		// alert(callback)
		var productModel = get_model();
		if (!productModel) {
			// alert("The \"Product\" model does not exist. Please create it before running this sample");
			// return false;
			var productModel = create_model();
			if (callback) {
				return callback(productModel);
			}
		} else {
			if (callback) {
				return callback(productModel);
			}
		}
	}

	function create() {
		var name = $('#name').val();
		var brand = $('#brand').val();
		var price = $('#price').val();
		// create model object and save it to database
		var product = if_model_exists(function(productModel) {
			var product = productModel.create({
				name: name,
				brand: brand,
				price: price
			});
			$("input").val("");
			var body_html = "<tr><td> Name : " + product.get("name") + "</td></tr><br/>"+"<tr><td> Brand : " + product.get("brand") + "</td></tr><br/>"+"<tr> <td>Price : " + product.get("price") + "<br/><hr></td></tr>";
			console.log("-------------------------")
			console.log(body_html)
			console.log("------------------------")
			refresh_view()
			Lungo.Router.back();
		});
	}


	function delete_product(id) {
			// alert(id)
			// console.log(id)
			create_model();
			var model = get_model();
			console.log(model)
			var product = model.find("first", {
				conditions: { "object": id }
			});
		console.log(product)
		product.destroy();
	}

	function refresh_view(){
			// alert("refresh_view")
			create_model();
			var model = get_model();
			var products = model.find("all");
			// alert(products)
			var body_html = "";
			for (var i = (products.length - 1); i >= 0; i--) {
				var product = products[i];
				var row_html = "<li><a href='#'></a><a href='#' class='button default red on-right delete_product' data-label='button' data-product-id='"+product.get("object")+"' style='color:#fff;'>Delete</a><strong>"+product.get("name")+"</strong></li>"
				body_html += row_html;

			}
			// alert(body_html)
		if (body_html != ""){
			$("#product_list").html(body_html).trigger("create");
		}else{
			$("#product_list").html("<li>Please Create Product</li>")
		}
	}
	
	$(document).on("click", ".delete_product", function() {
			var id = $(this).data("product-id").toString();
			delete_product(id);
			refresh_view();
	});