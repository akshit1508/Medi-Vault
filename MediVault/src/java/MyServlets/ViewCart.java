package MyServlets;

import java.io.*;
import java.sql.*;

import jakarta.servlet.http.*;

public class ViewCart extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/medivault", "root", "root");

            Statement stmt = con.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT name, price FROM products");

            out.println("<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'>");
            out.println("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");
            out.println("<title>Medical Billing</title>");
            out.println("<style>");
            out.println("body {");
            out.println("  font-family: 'Arial', sans-serif;");
            out.println("  background-color: #f2f7fc;");
            out.println("  color: #34495e;");
            out.println("  margin: 0;");
            out.println("  padding: 0;");
            out.println("}");
            out.println(".container {");
            out.println("  width: 90%;");
            out.println("  max-width: 1000px;");
            out.println("  margin: 40px auto;");
            out.println("  background: #ffffff;");
            out.println("  padding: 30px;");
            out.println("  border-radius: 12px;");
            out.println("  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);");
            out.println("}");
            out.println("h2 {");
            out.println("  text-align: center;");
            out.println("  font-size: 36px;");
            out.println("  color: #3498db;");
            out.println("  margin-bottom: 30px;");
            out.println("}");
            out.println(".form-group {");
            out.println("  margin-bottom: 20px;");
            out.println("}");
            out.println("label {");
            out.println("  display: block;");
            out.println("  font-size: 18px;");
            out.println("  margin-bottom: 6px;");
            out.println("  color: #7f8c8d;");
            out.println("}");
            out.println("input, select {");
            out.println("  width: 100%;");
            out.println("  padding: 12px;");
            out.println("  font-size: 16px;");
            out.println("  border: 1px solid #bdc3c7;");
            out.println("  border-radius: 6px;");
            out.println("  box-sizing: border-box;");
            out.println("  background-color: #ecf0f1;");
            out.println("  color: #34495e;");
            out.println("}");
            out.println("button {");
            out.println("  padding: 12px 24px;");
            out.println("  font-size: 16px;");
            out.println("  border: none;");
            out.println("  border-radius: 8px;");
            out.println("  cursor: pointer;");
            out.println("  background-color: #1abc9c;");
            out.println("  color: white;");
            out.println("  transition: 0.3s ease;");
            out.println("}");
            out.println(".form-group button:hover {");
            out.println("  background-color: #16a085;");
            out.println("}");
            out.println("table {");
            out.println("  width: 100%;");
            out.println("  border-collapse: collapse;");
            out.println("  margin-top: 20px;");
            out.println("}");
            out.println("th, td {");
            out.println("  padding: 12px;");
            out.println("  text-align: left;");
            out.println("  border-bottom: 1px solid #ecf0f1;");
            out.println("  font-size: 16px;");
            out.println("}");
            out.println("th {");
            out.println("  background-color: #3498db;");
            out.println("  color: white;");
            out.println("}");
            out.println("tr:hover {");
            out.println("  background-color: #f1f8fc;");
            out.println("}");
            out.println(".total-section {");
            out.println("  font-size: 18px;");
            out.println("  font-weight: bold;");
            out.println("  text-align: right;");
            out.println("  margin-top: 20px;");
            out.println("  color: #34495e;");
            out.println("}");
            out.println(".checkout-btn {");
            out.println("  background-color: #3498db;");
            out.println("  color: white;");
            out.println("  padding: 12px 24px;");
            out.println("  font-size: 16px;");
            out.println("  border: none;");
            out.println("  border-radius: 8px;");
            out.println("  cursor: pointer;");
            out.println("  transition: 0.3s ease;");
            out.println("}");
            out.println(".checkout-btn:hover {");
            out.println("  background-color: #2980b9;");
            out.println("}");
            out.println("</style>");
            out.println("</head><body>");
            out.println("<div class='container'><h2>MediVault Billing System</h2>");

            // Firm Name Input
            out.println("<div class='form-group'><label for='firmName'>Firm Name:</label>");
            out.println("<input type='text' id='firmName' name='firmName' required></div>");

            // Product Dropdown Code
            out.println("<div class='form-group'><label for='product'>Product:</label>");
            out.println("<select id='product' required><option value=''>--Select Product--</option>");
            while (rs.next()) {
                String name = rs.getString("name");
                double price = rs.getDouble("price");
                out.println("<option value='" + name + "' data-price='" + price + "'>" + name + " - $" + price + "</option>");
            }
            out.println("</select></div>");

            out.println("<div class='form-group'><label for='quantity'>Quantity:</label>");
            out.println("<input type='number' id='quantity' min='1' required></div>");
            out.println("<div class='form-group'><button type='button' onclick='addToCart()'>Add to Cart</button></div>");

            // Cart Table code
            out.println("<h3>Shopping Cart</h3>");
            out.println("<table id='cartTable'><thead><tr><th>Product</th><th>Quantity</th><th>Price</th><th>Total</th><th>Action</th></tr></thead><tbody></tbody></table>");
            out.println("<div class='total-section'><p id='totalLabel'>Total: $0</p></div>");
            out.println("<div class='form-group'><button class='checkout-btn' onclick='submitCart()'>Generate Bill</button></div>");

            // JavaScript code 
            out.println("<script>");
            out.println("let total = 0;");
            out.println("const cartTable = document.getElementById('cartTable').getElementsByTagName('tbody')[0];");

            out.println("function addToCart() {");
            out.println("  const productSelect = document.getElementById('product');");
            out.println("  const quantityInput = document.getElementById('quantity');");
            out.println("  const selectedOption = productSelect.options[productSelect.selectedIndex];");
            out.println("  const productName = selectedOption.getAttribute('value');");
            out.println("  const productPrice = parseFloat(selectedOption.getAttribute('data-price'));");
            out.println("  const quantity = parseInt(quantityInput.value);");
            out.println("  if (!productSelect.value || quantity < 1) return;");
            out.println("  const totalPrice = productPrice * quantity;");
            out.println("  const row = cartTable.insertRow();");
            out.println("  row.innerHTML = `<td>${productName}</td><td>${quantity}</td><td>$${productPrice}</td><td>$${totalPrice.toFixed(2)}</td><td><button onclick='removeFromCart(this, ${totalPrice})'>Remove</button></td>`;");
            out.println("  total += totalPrice;");
            out.println("  document.getElementById('totalLabel').innerText = `Total: $${total.toFixed(2)}`;");
            out.println("}");

            out.println("function removeFromCart(button, itemTotal) {");
            out.println("  const row = button.closest('tr'); row.remove();");
            out.println("  total -= itemTotal;");
            out.println("  document.getElementById('totalLabel').innerText = `Total: $${total.toFixed(2)}`;");
            out.println("}");

            // submit cart
            out.println("function submitCart() {");
            out.println("  const firmName = document.getElementById('firmName').value;");
            out.println("  if (!firmName.trim()) { alert('Please enter the firm name!'); return; }");

            out.println("  const rows = cartTable.getElementsByTagName('tr');");
            out.println("  if (rows.length === 0) { alert('Cart is empty!'); return; }");

            out.println("  const form = document.createElement('form');");
            out.println("  form.method = 'post';");
            out.println("  form.action = 'GenerateBill';");

            out.println("  const firmInput = document.createElement('input');");
            out.println("  firmInput.type = 'hidden';");
            out.println("  firmInput.name = 'firmName';");
            out.println("  firmInput.value = firmName;");
            out.println("  form.appendChild(firmInput);");

            out.println("  for (let i = 0; i < rows.length; i++) {");
            out.println("    const cells = rows[i].getElementsByTagName('td');");
            out.println("    const pname = cells[0].innerText;");
            out.println("    const qty = cells[1].innerText;");
            out.println("    const price = cells[2].innerText.replace('$', '');");

            out.println("    const hiddenFields = [");
            out.println("      {name: 'product', value: pname},");
            out.println("      {name: 'quantity', value: qty},");
            out.println("      {name: 'price', value: price}");
            out.println("    ];");

            out.println("    hiddenFields.forEach(f => {");
            out.println("      const input = document.createElement('input');");
            out.println("      input.type = 'hidden';");
            out.println("      input.name = f.name;");
            out.println("      input.value = f.value;");
            out.println("      form.appendChild(input);");
            out.println("    });");
            out.println("  }");

            out.println("  const totalInput = document.createElement('input');");
            out.println("  totalInput.type = 'hidden';");
            out.println("  totalInput.name = 'total';");
            out.println("  totalInput.value = total.toFixed(2);");
            out.println("  form.appendChild(totalInput);");

            out.println("  document.body.appendChild(form);");
            out.println("  form.submit();");
            out.println("}");
            out.println("</script></div></body></html>");

            con.close();
        } catch (Exception e) {
            out.println("<p>Error: " + e.getMessage() + "</p>");
        }
    }
}
