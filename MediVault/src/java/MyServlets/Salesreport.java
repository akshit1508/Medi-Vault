package MyServlets;

import java.io.*;
import java.sql.*;
import jakarta.servlet.http.*;


public class Salesreport extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        String reportType = request.getParameter("reportType");

        String groupField = "";
        String label = "";
        String fromDate = request.getParameter("fromDate");
        String toDate = request.getParameter("toDate");

        switch (reportType) {
            case "day":
                groupField = "DATE(bill_date)";
                label = "Date";
                break;
            case "month":
                groupField = "DATE_FORMAT(bill_date, '%Y-%m')";
                label = "Month";
                break;
            case "year":
                groupField = "YEAR(bill_date)";
                label = "Year";
                break;
            default:
                out.println("<p>Invalid report type</p>");
                return;
        }

        out.println("<html><head><title>Sales Report</title>");
        out.println("<style>");
        out.println("body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f0f8ff; padding: 40px; }");
        out.println(".report-container { max-width: 800px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 8px 15px rgba(0,0,0,0.1); }");
        out.println("h1, h2, h3 { text-align: center; color: #0056b3; }");
        out.println("table { width: 100%; border-collapse: collapse; margin-top: 25px; }");
        out.println("th, td { border: 1px solid #ccc; padding: 12px; text-align: center; }");
        out.println("th { background-color: #0077cc; color: white; }");
        out.println("tr:nth-child(even) { background-color: #f9f9f9; }");
        out.println(".footer { margin-top: 30px; text-align: center; }");
        out.println(".btn { margin: 10px; padding: 10px 25px; background-color: #0056b3; color: white; border: none; border-radius: 6px; cursor: pointer; text-decoration: none; font-size: 15px; }");
        out.println(".btn:hover { background-color: #003f87; }");
        out.println("@media print { .btn { display: none; } }");
        out.println("</style>");
        out.println("<script>function printReport() { window.print(); }</script>");
        out.println("</head><body>");
        out.println("<div class='report-container'>");

        out.println("<h1>MediVault Medical Store</h1>");
        out.println("<h2>" + label + " Wise Sales Report</h2>");

        if (fromDate != null && toDate != null && !fromDate.isEmpty() && !toDate.isEmpty()) {
            out.println("<h3>From: " + fromDate + " &nbsp;&nbsp; To: " + toDate + "</h3>");
        }

        out.println("<table><tr><th>" + label + "</th><th>Total Sales ($)</th></tr>");

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/medivault", "root", "root");

            String sql = "SELECT " + groupField + " AS label, SUM(total_amount) AS total_sales FROM bills";

            if (fromDate != null && toDate != null && !fromDate.isEmpty() && !toDate.isEmpty()) {
                sql += " WHERE bill_date BETWEEN ? AND ?";
            }

            sql += " GROUP BY label ORDER BY label DESC";

            PreparedStatement ps = con.prepareStatement(sql);

            if (fromDate != null && toDate != null && !fromDate.isEmpty() && !toDate.isEmpty()) {
                ps.setString(1, fromDate);
                ps.setString(2, toDate);
            }

            ResultSet rs = ps.executeQuery();

            boolean hasData = false;
            while (rs.next()) {
                hasData = true;
                out.println("<tr><td>" + rs.getString("label") + "</td><td>$" +
                        String.format("%.2f", rs.getDouble("total_sales")) + "</td></tr>");
            }

            if (!hasData) {
                out.println("<tr><td colspan='2'>No data found for the selected range.</td></tr>");
            }

            con.close();
        } catch (Exception e) {
            out.println("<tr><td colspan='2' style='color:red;'>Error: " + e.getMessage() + "</td></tr>");
        }

        out.println("</table>");

        out.println("<div class='footer'>");
        out.println("<button class='btn' onclick='printReport()'>🖨️ Print Report</button>");
        out.println("<a class='btn' href='/MediVault/MyHTML/salesreport.html'>🔙 Back</a>");
        out.println("</div>");

        out.println("</div></body></html>");
    }
}
