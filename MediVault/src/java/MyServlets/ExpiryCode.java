package MyServlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class ExpiryCode extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        Connection conn = null;
        PreparedStatement expiryStmt = null;
        PreparedStatement stockStmt = null;
        ResultSet expiryRs = null;
        ResultSet stockRs = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/medivault", "root", "root");

            LocalDate today = LocalDate.now();
            LocalDate alertDate = today.plusDays(15);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

         
            String expiryQuery = "SELECT id, name, expiry_date FROM products WHERE expiry_date BETWEEN ? AND ? AND expiry_alert = true";
            expiryStmt = conn.prepareStatement(expiryQuery);
            expiryStmt.setString(1, today.format(formatter));
            expiryStmt.setString(2, alertDate.format(formatter));
            expiryRs = expiryStmt.executeQuery();

            String stockQuery = "SELECT id, name, quantity, alert_threshold FROM products WHERE quantity <= alert_threshold AND quantity_alert_triggered = true";
            stockStmt = conn.prepareStatement(stockQuery);
            stockRs = stockStmt.executeQuery();

           
            out.println("<html><head><title>Alerts</title>");
            out.println("<style>");
            out.println("body { margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background: linear-gradient(to right, #667eea, #764ba2); }");
            out.println(".modal { display: flex; align-items: center; justify-content: center; position: fixed; z-index: 999; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); }");
            out.println(".modal-content { background-color: #fff; padding: 30px; border-radius: 15px; width: 85%; max-width: 1100px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4); animation: slideIn 0.6s ease-out; display: flex; flex-direction: column; }");
            out.println(".modal-header { display: flex; align-items: center; justify-content: space-between; }");
            out.println(".modal-header h2 { color: #4a148c; margin: 0; font-size: 24px; }");
            out.println(".modal-body { display: flex; flex-direction: row; justify-content: space-between; gap: 25px; margin-top: 20px; }");
            out.println(".section { flex: 1; background: #ffffff; border: 2px solid #2e0854; border-radius: 10px; padding: 20px; overflow-y: auto; max-height: 400px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }");
            out.println(".section h3 { color: #2e0854; border-bottom: 2px solid #2e0854; padding-bottom: 10px; margin-bottom: 15px; font-size: 18px; }");
            out.println(".section p { margin: 8px 0; font-size: 15px; background: #f1f1fc; padding: 10px; border-radius: 5px; border-left: 4px solid #4a148c; }");
            out.println(".section p:hover { background: #e6e0f8; }");
            out.println(".close { color: #888; float: right; font-size: 28px; font-weight: bold; cursor: pointer; }");
            out.println(".close:hover { color: red; }");
            out.println(".ok-button { margin-top: 25px; align-self: center; background-color: #4a148c; color: white; border: none; padding: 12px 30px; border-radius: 25px; font-size: 16px; cursor: pointer; transition: 0.3s ease; }");
            out.println(".ok-button:hover { background-color: #2e0854; }");
            out.println("@keyframes slideIn { from { opacity: 0; transform: translateY(-50px); } to { opacity: 1; transform: translateY(0); } }");
            out.println("</style>");
            out.println("</head><body>");

            StringBuilder expiryAlerts = new StringBuilder();
            while (expiryRs.next()) {
                expiryAlerts.append("<p><strong>Product:</strong> ").append(expiryRs.getString("name"))
                        .append(" | <strong>Expiry Date:</strong> ").append(expiryRs.getString("expiry_date")).append("</p>");
            }

            StringBuilder stockAlerts = new StringBuilder();
            while (stockRs.next()) {
                stockAlerts.append("<p><strong>Product:</strong> ").append(stockRs.getString("name"))
                        .append(" | <strong>Qty:</strong> ").append(stockRs.getInt("quantity"))
                        .append(" | <strong>Threshold:</strong> ").append(stockRs.getInt("alert_threshold")).append("</p>");
            }

            if (expiryAlerts.length() > 0 || stockAlerts.length() > 0) {
                out.println("<div id='myModal' class='modal'>");
                out.println("<div class='modal-content'>");

                
                out.println("<div class='modal-header'>");
                out.println("<h2><i class='fas fa-bell'></i> SPECIAL ALERTS</h2>");
                out.println("</div>");

                out.println("<div class='modal-body'>");

                out.println("<div class='section'><h3>Expiry Alerts</h3>");
                out.println(expiryAlerts.length() > 0 ? expiryAlerts.toString() : "<p>No expiry alerts.</p>");
                out.println("</div>");

                out.println("<div class='section'><h3>Stock Alerts</h3>");
                out.println(stockAlerts.length() > 0 ? stockAlerts.toString() : "<p>No stock alerts.</p>");
                out.println("</div>");

                out.println("</div>");

              
                out.println("<button class='ok-button' onclick=\"window.location.href='/MediVault/MyHTML/Homepage.html'\">OK</button>");

                out.println("</div></div>");
            } else {
              
                out.println("<script>alert('No expiry or stock alerts at this time.'); window.location.href='/MediVault/MyHTML/Homepage.html';</script>");
            }

            out.println("</body></html>");

        } catch (Exception e) {
            e.printStackTrace();
            out.println("<script>alert('Error: " + e.getMessage() + "'); window.location.href='/MediVault/MyHTML/Homepage.html';</script>");
        } finally {
            try { if (expiryRs != null) expiryRs.close(); } catch (Exception ignored) {}
            try { if (stockRs != null) stockRs.close(); } catch (Exception ignored) {}
            try { if (expiryStmt != null) expiryStmt.close(); } catch (Exception ignored) {}
            try { if (stockStmt != null) stockStmt.close(); } catch (Exception ignored) {}
            try { if (conn != null) conn.close(); } catch (Exception ignored) {}
        }
    }
}
