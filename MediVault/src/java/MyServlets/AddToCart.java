package MyServlets;

import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.sql.*;
import java.util.*;

public class AddToCart extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        HttpSession session = request.getSession();

        String medName = request.getParameter("medicine");
        int quantity = Integer.parseInt(request.getParameter("quantity"));

        List<String[]> cart = (List<String[]>) session.getAttribute("cart");
        if (cart == null) {
            cart = new ArrayList<>();
        }

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/medivault", "root", "");

            PreparedStatement ps = con.prepareStatement("SELECT price FROM product WHERE name = ?");
            ps.setString(1, medName);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                double price = rs.getDouble("price");
                double total = price * quantity;
                cart.add(new String[]{medName, String.valueOf(quantity), String.valueOf(price), String.valueOf(total)});
                session.setAttribute("cart", cart);
            }

            con.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

       
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<h2>Cart</h2><table border='1'><tr><th>Medicine</th><th>Quantity</th><th>Price</th><th>Total</th></tr>");

        double grandTotal = 0;
        for (String[] item : cart) {
            out.println("<tr>");
            for (String val : item) out.println("<td>" + val + "</td>");
            out.println("</tr>");
            grandTotal += Double.parseDouble(item[3]);
        }
        out.println("</table>");
        out.println("<p>Grand Total: ₹" + grandTotal + "</p>");
        out.println("<form action='/MediVault/CheckoutServlet' method='post'><input type='submit' value='Confirm and Checkout'></form>");
        out.println("<a href='/MediVault/MyHTML/Billing.html'>Add More</a>");
    }
}
