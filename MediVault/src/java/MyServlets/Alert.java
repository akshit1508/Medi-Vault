package MyServlets;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Alert extends HttpServlet {

  
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");

      
        String type = request.getParameter("type");
        StringBuilder alertMessage = new StringBuilder();

       
        alertMessage.append("<html><head><title>Alerts</title><style>");
        alertMessage.append("body { font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; }");
        alertMessage.append("h3 { color: #333; text-align: center; }");
        alertMessage.append("p { font-size: 16px; color: #555; padding: 10px; background-color: #e7f3fe; border-left: 5px solid #007bff; margin: 10px 0; }");
        alertMessage.append("p.stock-alert { background-color: #ffcccc; border-left-color: #ff0000; }");
        alertMessage.append("p.expiry-alert { background-color: #fff3cd; border-left-color: #ffcc00; }");
        alertMessage.append("</style></head><body>");

        
        try {
            Class.forName("com.mysql.cj.jdbc.Driver"); // Ensure JDBC driver is loaded
        } catch (ClassNotFoundException e) {
            response.getWriter().write("<p>JDBC Driver not found: " + e.getMessage() + "</p>");
            Logger.getLogger(Alert.class.getName()).log(Level.SEVERE, null, e);
            return;
        }

        try (Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/medivault", "root", "root");
             Statement stmt = conn.createStatement()) {

            if ("expiry".equals(type)) {
                // Expiry alerts
                ResultSet rs = stmt.executeQuery(
                    "SELECT name, expiry_date FROM products WHERE expiry_alert = TRUE AND expiry_date <= CURRENT_DATE");
                
                alertMessage.append("<h3>Expiry Alerts</h3>");
                while (rs.next()) {
                    alertMessage.append("<p class='expiry-alert'>Expiry Alert: ").append(rs.getString("name"))
                            .append(" expires on ").append(rs.getDate("expiry_date")).append("</p>");
                }
            } else if ("stock".equals(type)) {
                // Stock alerts
                ResultSet rs = stmt.executeQuery(
                    "SELECT name, quantity FROM products WHERE quantity <= alert_threshold");

                alertMessage.append("<h3>Stock Alerts</h3>");
                while (rs.next()) {
                    alertMessage.append("<p class='stock-alert'>Stock Alert: ").append(rs.getString("name"))
                            .append(" has low stock (").append(rs.getInt("quantity")).append(")</p>");
                }
            }

        } catch (SQLException e) {
            alertMessage.append("<p>Error fetching data from database: ").append(e.getMessage()).append("</p>");
            Logger.getLogger(Alert.class.getName()).log(Level.SEVERE, null, e);
        }

       
        alertMessage.append("</body></html>");
        response.getWriter().write(alertMessage.toString());
    }
}
