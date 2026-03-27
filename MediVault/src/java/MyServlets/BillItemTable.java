package MyServlets;

import java.io.*;
import java.sql.*;
import jakarta.servlet.http.*;

public class BillItemTable extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

      
        out.println("<html><head><title>View Bill Items</title>");
        out.println("<style>");
        out.println("body { font-family: 'Segoe UI', sans-serif; background: #e9f5ff; margin: 0; padding: 30px; }");
        out.println(".container { background: #ffffff; max-width: 1000px; margin: auto; padding: 30px; border-radius: 10px; box-shadow: 0 8px 20px rgba(0,0,0,0.15); }");
        out.println("h2 { text-align: center; color: #2c7be5; margin-bottom: 30px; }");
        out.println("table { width: 100%; border-collapse: collapse; margin-top: 20px; }");
        out.println("th, td { padding: 14px 18px; text-align: center; font-size: 16px; border-bottom: 1px solid #ddd; }");
        out.println("th { background-color: #2c7be5; color: white; letter-spacing: 0.5px; }");
        out.println("tr:nth-child(even) { background-color: #f1f9ff; }");
        out.println("tr:hover { background-color: #d6ecff; transition: 0.3s; }");
        out.println(".btn { margin-top: 25px; text-align: center; }");
        out.println(".btn button { background-color: #2c7be5; color: white; border: none; padding: 12px 28px; font-size: 16px; border-radius: 6px; cursor: pointer; transition: 0.3s; }");
        out.println(".btn button:hover { background-color: #1a5fb4; }");
        out.println("</style>");
        out.println("</head><body>");

        out.println("<div class='container'>");
        out.println("<h2>Bill Items Record</h2>");

        try {
            
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/medivault", "root", "root");

            Statement stmt = con.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM bill_items");

            out.println("<table>");
            out.println("<tr><th>Item ID</th><th>Bill ID</th><th>Product Name</th><th>Quantity</th><th>Price ($)</th><th>Total ($)</th></tr>");

            boolean hasData = false;
            while (rs.next()) {
                hasData = true;
                int itemId = rs.getInt("item_id");
                int billId = rs.getInt("bill_id");
                String productName = rs.getString("product_name");
                int quantity = rs.getInt("quantity");
                double price = rs.getDouble("price");
                double total = quantity * price;

                out.println("<tr>");
                out.println("<td>" + itemId + "</td>");
                out.println("<td>" + billId + "</td>");
                out.println("<td>" + productName + "</td>");
                out.println("<td>" + quantity + "</td>");
                out.println("<td>" + String.format("%.2f", price) + "</td>");
                out.println("<td>" + String.format("%.2f", total) + "</td>");
                out.println("</tr>");
            }

            if (!hasData) {
                out.println("<tr><td colspan='6'>No Bill Items Found</td></tr>");
            }

            out.println("</table>");
            out.println("<div class='btn'><button onclick='history.back()'>⬅️ Go Back</button></div>");

            con.close();
        } catch (Exception e) {
            out.println("<p style='color:red; text-align:center;'>Error: " + e.getMessage() + "</p>");
        }

        out.println("</div></body></html>");
    }
}
