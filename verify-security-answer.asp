<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<%
    Response.ContentType = "application/json"

    dim userID, answer
    userID = Request.Form("userID")
    answer = Request.Form("answer")

    ' 检查输入是否为空
    if userID = "" or answer = "" then
        Response.Write "{""success"": false, ""message"": ""请输入信息""}"
        Response.End
    end if

    ' 连接到数据库
    dim conn, sql, rs
    set conn = Server.CreateObject("ADODB.Connection")
    conn.Open "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" & Server.MapPath("user-data.mdb")

    ' 查询数据库，验证密保问题答案
    sql = "SELECT SecurityAnswer FROM Users WHERE UserID = " & userID
    set rs = conn.Execute(sql)

    if not rs.EOF then
        dim storedAnswer
        storedAnswer = rs("SecurityAnswer")

        if storedAnswer = answer then
            Response.Write "{""success"": true}"
        else
            Response.Write "{""success"": false, ""message"": ""回答不正确""}"
        end if
    else
        Response.Write "{""success"": false, ""message"": ""未找到相关用户""}"
    end if

    ' 关闭连接
    rs.Close
    conn.Close
    set rs = nothing
    set conn = nothing
%>
