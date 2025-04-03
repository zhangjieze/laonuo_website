<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<%
    Response.ContentType = "application/json"

    dim username, email, password
    username = Request.Form("username")
    email = Request.Form("email")
    password = Request.Form("password")

    ' 打开数据库连接
    dim conn, sql
    set conn = Server.CreateObject("ADODB.Connection")
    conn.Open "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" & Server.MapPath("user-data.mdb")

    ' 检查用户名是否存在
    sql = "SELECT * FROM Users WHERE Username = '" & Replace(username, "'", "''") & "'"
    dim rs
    set rs = conn.Execute(sql)

    if not rs.EOF then
        Response.Write "{""success"": false, ""message"": ""用户名已存在""}"
        Response.End
    end if

    ' 插入用户信息
    sql = "INSERT INTO [Users] ([Username], [Email], [Password]) VALUES ('" & Replace(username, "'", "''") & "', '" & Replace(email, "'", "''") & "', '" & Replace(password, "'", "''") & "')"
    conn.Execute(sql)

    ' 获取插入的用户ID
    set rs = conn.Execute("SELECT @@IDENTITY AS UserID")
    dim userID
    userID = rs("UserID")

    ' 返回成功消息
    Response.Write "{""success"": true, ""message"": ""注册成功！"", ""userID"": " & userID & "}"
    conn.Close
    set conn = nothing
%>