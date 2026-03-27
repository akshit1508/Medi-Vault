package MyServlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


public class Signup extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String special = request.getParameter("special");
        String role = request.getParameter("role");
        String email = request.getParameter("email");
        String phone = request.getParameter("phone");

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        
        out.println("<html><head><title>Registration Result</title>");
        out.println("<style>");
        out.println("body { background: linear-gradient(to right, #00c6ff, #0072ff); font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; }");
        out.println(".container { max-width: 600px; margin: 100px auto; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 0 15px rgba(0,0,0,0.3); text-align: center; }");
        out.println("h2 { color: #0072ff; margin-bottom: 20px; }");
        out.println("p { font-size: 18px; color: #333; }");
        out.println("a { display: inline-block; margin-top: 20px; text-decoration: none; padding: 10px 25px; background-color: #0072ff; color: white; border-radius: 5px; transition: background 0.3s ease; }");
        out.println("a:hover { background-color: #005dc1; }");
        out.println("</style>");
        out.println("</head><body><div class='container'>");

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/medivault", "root", "root"
            );

            String query = "INSERT INTO users (username, password, special_character, role, email, phone) VALUES (?, ?, ?, ?, ?, ?)";
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setString(1, username);
            stmt.setString(2, password);
            stmt.setString(3, special);
            stmt.setString(4, role);
            stmt.setString(5, email);
            stmt.setString(6, phone);

            int result = stmt.executeUpdate();

            if (result > 0) {
                out.println("<h2>🎉 Registration Successful!</h2>");
                out.println("<p>Welcome, <strong>" + username + "</strong>! You can now log in.</p>");
                out.println("<a href='/MediVault/MyHTML/Login.html'>Go to Login</a>");
            } else {
                out.println("<h2>❌ Registration Failed!</h2>");
                out.println("<p>Something went wrong. Please try again.</p>");
            }

            stmt.close();
            conn.close();

        } catch (Exception e) {
            out.println("<h2>🚫 Error Occurred!</h2>");
            out.println("<p>" + e.getMessage() + "</p>");
        }

        out.println("</div></body></html>");
    }
}
