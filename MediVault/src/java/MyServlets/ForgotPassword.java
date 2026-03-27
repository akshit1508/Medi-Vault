package MyServlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import jakarta.servlet.ServletException;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class ForgotPassword extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String email = request.getParameter("email");
        String phone = request.getParameter("phone");
        String special = request.getParameter("name");

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/medivault", "root", "root");

            String query = "SELECT username, password FROM users WHERE email=? AND phone=? AND special_character=?";
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setString(1, email);
            stmt.setString(2, phone);
            stmt.setString(3, special);

            ResultSet rs = stmt.executeQuery();

            out.println("<html><head><title>Account Recovery</title>");
            out.println("<style>");
            out.println("body { background: linear-gradient(to right, #5f2c82, #49a09d); font-family: Arial, sans-serif; margin: 0; padding: 0; }");
            out.println(".container { max-width: 500px; margin: 100px auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0px 4px 15px rgba(0,0,0,0.3); text-align: center; }");
            out.println("h2 { color: #4a148c; }");
            out.println("p { font-size: 18px; color: #333; }");
            out.println("button { margin-top: 20px; padding: 10px 25px; background: #4a148c; color: white; border: none; border-radius: 5px; cursor: pointer; }");
            out.println("button:hover { background: #6a1b9a; }");
            out.println("</style>");
            out.println("</head><body>");
            out.println("<div class='container'>");

            if (rs.next()) {
                String username = rs.getString("username");
                String password = rs.getString("password");

                out.println("<h2>Account Details Found</h2>");
                out.println("<p><strong>Username:</strong> " + username + "</p>");
                out.println("<p><strong>Password:</strong> " + password + "</p>");
            } else {
                out.println("<h2>No Matching Records Found</h2>");
                out.println("<p>Please ensure your email, phone number, and special text are correct.</p>");
            }

            out.println("<button onclick=\"window.location.href='/MediVault/MyHTML/LoginCode.html'\">Back to Login</button>");
            out.println("</div></body></html>");

            rs.close();
            stmt.close();
            conn.close();

        } catch (Exception e) {
            out.println("<script>alert('Error: " + e.getMessage() + "');</script>");
            e.printStackTrace();
        }
    }
}
