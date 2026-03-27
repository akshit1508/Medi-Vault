package MyServlets;

import java.io.*;
import java.sql.*;
import jakarta.servlet.http.*;

public class GenerateBill extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        String firmName = request.getParameter("firmName");
        String[] products = request.getParameterValues("product");
        String[] quantities = request.getParameterValues("quantity");
        String[] prices = request.getParameterValues("price");
        String total = request.getParameter("total");

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/medivault", "root", "root");

           
            PreparedStatement ps = con.prepareStatement(
                "INSERT INTO bills (firm_name, total_amount, bill_date) VALUES (?, ?, NOW())",
                Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, firmName);
            ps.setDouble(2, Double.parseDouble(total));
            ps.executeUpdate();

            ResultSet rs = ps.getGeneratedKeys();
            int billId = 0;
            String billDateTime = "";
            if (rs.next()) {
                billId = rs.getInt(1);
            }

            
            PreparedStatement billInfoStmt = con.prepareStatement(
                "SELECT bill_date FROM bills WHERE bill_id = ?");
            billInfoStmt.setInt(1, billId);
            ResultSet billRs = billInfoStmt.executeQuery();
            if (billRs.next()) {
                billDateTime = billRs.getString("bill_date");
            }

           
            PreparedStatement itemStmt = con.prepareStatement(
                "INSERT INTO bill_items (bill_id, product_name, quantity, price) VALUES (?, ?, ?, ?)");
            PreparedStatement updateStockStmt = con.prepareStatement(
                "UPDATE products SET quantity = quantity - ? WHERE name = ?");

            for (int i = 0; i < products.length; i++) {
                int qty = Integer.parseInt(quantities[i]);
                double price = Double.parseDouble(prices[i]);

                itemStmt.setInt(1, billId);
                itemStmt.setString(2, products[i]);
                itemStmt.setInt(3, qty);
                itemStmt.setDouble(4, price);
                itemStmt.executeUpdate();

              
                updateStockStmt.setInt(1, qty);
                updateStockStmt.setString(2, products[i]);
                updateStockStmt.executeUpdate();
            }

            
            out.println("<html><head><title>Bill</title>");
            out.println("<style>");
            out.println("body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f8ff; margin: 0; padding: 20px; }");
            out.println(".invoice { background: #ffffff; padding: 30px; border-radius: 12px; width: 80%; max-width: 900px; margin: 0 auto; box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15); }");
            out.println("h2 { text-align: center; color: #5c6bc0; }");
            out.println("table { width: 100%; border-collapse: collapse; margin-top: 30px; }");
            out.println("th, td { padding: 14px; text-align: left; border-bottom: 1px solid #ddd; font-size: 16px; }");
            out.println("th { background: #7986cb; color: #ffffff; }");
            out.println("tr:nth-child(even) { background-color: #f9f9f9; }");
            out.println(".total { text-align: right; font-size: 20px; margin-top: 20px; color: #5c6bc0; font-weight: bold; }");
            out.println(".print-btn { margin-top: 30px; text-align: center; }");
            out.println(".print-btn button { background-color: #5c6bc0; color: white; border: none; padding: 12px 30px; font-size: 16px; border-radius: 6px; cursor: pointer; transition: 0.3s; }");
            out.println(".print-btn button:hover { background-color: #3949ab; }");
            out.println("@media print { .print-btn { display: none; } }");
            out.println("</style>");
            out.println("<script>function printInvoice() { window.print(); }</script>");
            out.println("</head><body>");
            out.println("<div class='invoice'>");

            out.println("<h2>Bill Of - " + firmName + "</h2>");
            out.println("<p><strong>Bill ID:</strong> " + billId + "</p>");
            out.println("<p><strong>Date & Time:</strong> " + billDateTime + "</p>");

            out.println("<table>");
            out.println("<thead><tr><th>Product</th><th>Quantity</th><th>Price ($)</th><th>Total ($)</th></tr></thead><tbody>");
            double grandTotal = 0;
            for (int i = 0; i < products.length; i++) {
                double qty = Double.parseDouble(quantities[i]);
                double price = Double.parseDouble(prices[i]);
                double lineTotal = qty * price;
                grandTotal += lineTotal;
                out.println("<tr><td>" + products[i] + "</td><td>" + qty + "</td><td>" + String.format("%.2f", price) + "</td><td>" + String.format("%.2f", lineTotal) + "</td></tr>");
            }
            out.println("</tbody></table>");

            out.println("<p class='total'>Grand Total: $" + String.format("%.2f", grandTotal) + "</p>");
            out.println("<div class='print-btn'><button onclick='printInvoice()'>🖨️ Print Bill</button></div>");

            out.println("</div></body></html>");

            con.close();
        } catch (Exception e) {
            out.println("<p style='color:red;'>Error: " + e.getMessage() + "</p>");
        }
    }
}
