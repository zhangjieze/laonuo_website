<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<%
    Response.ContentType = "application/json"

    dim email
    email = Request.Form("email")

    ' 检查输入是否为空
    if email = "" then
        Response.Write "{""success"": false, ""message"": ""请输入用户名或电子邮件""}"
        Response.End
    end if

    ' 连接到数据库
    dim conn, sql, rs
    set conn = Server.CreateObject("ADODB.Connection")
    conn.Open "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" & Server.MapPath("user-data.mdb")

    ' 查询数据库，获取密保问题
    sql = "SELECT UserID, SecurityQuestion FROM Users WHERE Username = '" & Replace(email, "'", "''") & "' OR Email = '" & Replace(email, "'", "''") & "'"
    set rs = conn.Execute(sql)

    if not rs.EOF then
        dim userID, securityQuestion
        userID = rs("UserID")
        securityQuestion = rs("SecurityQuestion")

        Response.Write "{""success"": true, ""userID"": " & userID & ", ""securityQuestion"": """ & securityQuestion & """}"
    else
        Response.Write "{""success"": false, ""message"": ""未找到相关用户""}"
    end if

    ' 关闭连接
    rs.Close
    conn.Close
    set rs = nothing
    set conn = nothing
%>
