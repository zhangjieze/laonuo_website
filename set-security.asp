<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<%
    Response.ContentType = "application/json"

    dim userID, question, answer
    userID = Request.Form("userID")
    question = Request.Form("question")
    answer = Request.Form("answer")

    ' 打开数据库连接
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

    ' 如果用户名存在，更新密保问题和答案
    sql = "UPDATE Users SET SecurityQuestion = '" & Replace(question, "'", "''") & "', SecurityAnswer = '" & Replace(answer, "'", "''") & "' WHERE UserID = " & userID
    conn.Execute(sql)

    ' 返回成功消息
    Response.Write "{""success"": true}"
    conn.Close
    set conn = nothing
%>
