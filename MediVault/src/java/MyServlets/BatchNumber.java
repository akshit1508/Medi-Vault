package MyServlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class BatchNumber extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
     
        String batchNumber = request.getParameter("batch_number");

        
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/medivault", "root", "root");

            String query = "SELECT * FROM products WHERE batch_number LIKE ?";
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setString(1, "%" + batchNumber + "%"); // Use LIKE for partial matching
            ResultSet rs = stmt.executeQuery();

            
            out.println("<html><head><title>Search Results</title></head><body>");
            out.println("<link rel='stylesheet' href='/MediVault/MyCSS/ProductTable.css'>");
            out.println("<h1>Products List for Batch Number: " + batchNumber + "</h1>");
            out.println("<table border='1'>");
            out.println("<tr><th>ID</th><th>Name</th><th>Batch Number</th><th>Category</th><th>Drug Type</th><th>Price</th><th>Expiry Date</th><th>Description</th><th>Alert Threshold</th><th>Quantity</th><th>Expiry Alert</th><th>Expiry Alert Date</th><th>Quantity Alert Triggered</th></tr>");
            
                        boolean hasResults = false;

            while (rs.next()) {
                hasResults = true; 
                out.println("<tr>");
                out.println("<td>" + rs.getInt("id") + "</td>");
                out.println("<td>" + rs.getString("name") + "</td>");
                out.println("<td>" + rs.getString("batch_number") + "</td>");
                out.println("<td>" + rs.getString("category") + "</td>");
                out.println("<td>" + rs.getString("drug_type") + "</td>");
                out.println("<td>" + rs.getBigDecimal("price") + "</td>");
                out.println("<td>" + rs.getDate("expiry_date") + "</td>");
                out.println("<td>" + rs.getString("description") + "</td>");
                out.println("<td>" + rs.getInt("alert_threshold") + "</td>");
                out.println("<td>" + rs.getInt("quantity") + "</td>");
                out.println("<td>" + rs.getBoolean("expiry_alert") + "</td>");
                out.println("<td>" + rs.getDate("expiry_alert_date") + "</td>");
                out.println("<td>" + rs.getBoolean("quantity_alert_triggered") + "</td>");
                out.println("</tr>");
            }

            if (!hasResults) {
                out.println("<tr><td colspan='13'>No products found for the given batch number.</td></tr>");
            }

            out.println("</table>");

            
            rs.close();
            stmt.close();
            conn.close();

            out.println("</body></html>");

        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().println("Error: " + e.getMessage());
        }
    }
}
