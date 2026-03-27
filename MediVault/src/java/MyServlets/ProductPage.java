package MyServlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class ProductPage extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
     
        String id = request.getParameter("id");
        String name = request.getParameter("name");
        String batchNumber = request.getParameter("batch_number");
        String category = request.getParameter("category");
        String drugType = request.getParameter("drug_type");
        String price = request.getParameter("price");
        String expiryDate = request.getParameter("expiry_date");
        String description = request.getParameter("description");
        String alertThreshold = request.getParameter("alert_threshold");
        String quantity = request.getParameter("quantity");
        String expiryAlert = request.getParameter("expiry_alert");
        String customExpiryAlertDate = request.getParameter("custom_expiry_alert_date");

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            
            if (name == null || name.isEmpty() || price == null || expiryDate == null || quantity == null || id == null || drugType == null) {
                out.println("Error: Please fill in all required fields.");
                return;
            }

            
            java.sql.Date sqlExpiryDate = java.sql.Date.valueOf(expiryDate);
            if (sqlExpiryDate.before(java.sql.Date.valueOf(java.time.LocalDate.now()))) {
                out.println("Error: Expiry date cannot be in the past.");
                return;
            }

            
            if (Integer.parseInt(alertThreshold) >= Integer.parseInt(quantity)) {
                out.println("Error: Alert threshold must be less than quantity.");
                return;
            }

            
            if (customExpiryAlertDate != null && !customExpiryAlertDate.isEmpty()) {
                java.sql.Date sqlExpiryAlertDate = java.sql.Date.valueOf(customExpiryAlertDate);
                if (sqlExpiryAlertDate.after(sqlExpiryDate)) {
                    out.println("Error: Expiry alert date must be before the expiry date.");
                    return;
                }
            }

            
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/medivault", "root", "root");

            
            String sql = "INSERT INTO products (id, name, batch_number, category, drug_type, price, expiry_date, description, alert_threshold, quantity, expiry_alert, expiry_alert_date, quantity_alert_triggered) "
                       + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setInt(1, Integer.parseInt(id));
            stmt.setString(2, name);
            stmt.setString(3, batchNumber);
            stmt.setString(4, category);
            stmt.setString(5, drugType);
            stmt.setBigDecimal(6, new java.math.BigDecimal(price));
            stmt.setDate(7, sqlExpiryDate);
            stmt.setString(8, description);
            stmt.setInt(9, Integer.parseInt(alertThreshold));
            stmt.setInt(10, Integer.parseInt(quantity));
            stmt.setBoolean(11, "on".equals(expiryAlert));
            stmt.setDate(12, customExpiryAlertDate != null && !customExpiryAlertDate.isEmpty() ? java.sql.Date.valueOf(customExpiryAlertDate) : null);
            stmt.setBoolean(13, Integer.parseInt(quantity) <= Integer.parseInt(alertThreshold));

            int rowsInserted = stmt.executeUpdate();
            if (rowsInserted > 0) {
                out.println("Product added successfully.");
            } else {
                out.println("Error: Unable to add product.");
            }

            conn.close();
        } catch (Exception e) {
            out.println("Error: " + e.getMessage());
        }
    }
}
