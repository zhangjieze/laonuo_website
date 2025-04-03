<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<%
    Response.ContentType = "application/json"

    dim userID, newPassword
    userID = Request.Form("userID")
    newPassword = Request.Form("newPassword")

    ' 连接到数据库
    dim conn, sql
    set conn = Server.CreateObject("ADODB.Connection")
    conn.Open "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" & Server.MapPath("user-data.mdb")

    ' 查找用户名是否存在
    sql = "SELECT * FROM Users WHERE UserID = " & userID
    set rs = conn.Execute(sql)

     if rs.EOF then
        ' 如果用户名不存在，返回错误信息
        Response.Write "{""success"": false, ""message"": ""用户名不存在""}"
        conn.Close
        set conn = nothing
        Response.End
    end if

    ' 更新密码
    sql = "UPDATE Users SET [Password] = '" & Replace(newPassword, "'", "''") & "' WHERE UserID = " & userID
    conn.Execute(sql)

    Response.Write "{""success"": true, ""message"": ""密码重置成功""}"

    ' 关闭连接
    conn.Close
    set conn = nothing
%>
