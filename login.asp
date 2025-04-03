<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<%
    Response.ContentType = "application/json"

    dim username, password
    username = Request.Form("username")
    password = Request.Form("password")

    ' 打开数据库连接
    dim conn, sql
    set conn = Server.CreateObject("ADODB.Connection")
    conn.Open "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" & Server.MapPath("user-data.mdb")

    ' 查询用户名和密码是否匹配
    sql = "SELECT * FROM Users WHERE Username = '" & Replace(username, "'", "''") & "' AND Password = '" & Replace(password, "'", "''") & "'"
    dim rs
    set rs = conn.Execute(sql)

    ' 如果匹配，返回用户信息
    if not rs.EOF then
        dim userID, userUsername
        userID = rs("UserID")
        userUsername = rs("Username")

        Response.Write "{""success"": true, ""userID"": " & userID & ", ""username"": """ & userUsername & """}"
    else
        ' 用户名或密码错误
        Response.Write "{""success"": false, ""message"": ""用户名或密码错误""}"
    end if

    ' 关闭连接
    rs.Close
    conn.Close
    set rs = nothing
    set conn = nothing
%>
