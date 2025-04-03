<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<%
    Response.ContentType = "text/html; charset=UTF-8"
    
    ' 获取当前页码和Username
    dim page, username
    page = Request.QueryString("page")
    username = Request.QueryString("Username")

    ' 调试输出，确认是否正确获取参数
    Response.Write "<!-- Debug: Page = " & page & " | Username = " & username & " -->"

    if page = "" then page = 1
    dim pageSize
    pageSize = 10

    ' 打开数据库连接
    dim conn, sql, rs, totalUsers, userRank
    set conn = Server.CreateObject("ADODB.Connection")
    conn.Open "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" & Server.MapPath("score.mdb")

    ' 获取所有用户数目
    set rs = conn.Execute("SELECT COUNT(*) AS total FROM score")
    totalUsers = rs("total")

    ' 获取排名并转换时间格式为总秒数排序
    sql = "SELECT *, (SELECT COUNT(*) FROM score AS s2 WHERE CDbl(s2.s_score) > CDbl(s1.s_score) " & _
          "OR (CDbl(s2.s_score) = CDbl(s1.s_score) AND (CInt(Left(s2.s_time, Instr(s2.s_time, ' 分钟') - 1)) * 60 + CInt(Mid(s2.s_time, Instr(s2.s_time, '分钟') + 3, Instr(s2.s_time, '秒') - Instr(s2.s_time, '分钟') - 3))) " & _
          "< (CInt(Left(s1.s_time, Instr(s1.s_time, ' 分钟') - 1)) * 60 + CInt(Mid(s1.s_time, Instr(s1.s_time, '分钟') + 3, Instr(s1.s_time, '秒') - Instr(s1.s_time, '分钟') - 3))))) + 1 AS rank " & _
          "FROM score AS s1 ORDER BY CDbl(s1.s_score) DESC, " & _
          "(CInt(Left(s1.s_time, Instr(s1.s_time, ' 分钟') - 1)) * 60 + CInt(Mid(s1.s_time, Instr(s1.s_time, '分钟') + 3, Instr(s1.s_time, '秒') - Instr(s1.s_time, '分钟') - 3))) ASC"
    set rs = conn.Execute(sql)

    ' 获取当前用户的排名
    userRank = -1
    do while not rs.EOF
        if rs("s_name") = username then
            userRank = rs("rank")
            exit do
        end if
        rs.MoveNext
    loop
    rs.MoveFirst ' 重置记录集

    ' 计算分页
    dim startRow, endRow
    startRow = (page - 1) * pageSize + 1
    endRow = page * pageSize
    rs.Move startRow - 1

    ' 输出表格头
%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>排行榜</title>
    <link rel="stylesheet" type="text/css" href="css/ranking_styles.css">
    <script>
        // JavaScript 用于获取URL参数
        function getQueryParam(param) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
        }

        // 使用JavaScript打印当前查询参数
        window.onload = function() {
            const page = getQueryParam('page');
            const username = getQueryParam('Username');
            console.log("Current Page: " + page + " | Username: " + username);
        }
    </script>
</head>
<body>
    <h1>排行榜</h1>
    <p style="text-align:center;">您在 <%= totalUsers %> 名用户中排名第 <%= userRank %> 名</p>
    <table>
        <tr>
            <th>排名</th>
            <th>用户名</th>
            <th>分数</th>
            <th>作答时间</th>
        </tr>
<%
    ' 输出当前页的数据
    dim rowCount
    rowCount = 0
    do while not rs.EOF and rowCount < pageSize
        dim isUser
        isUser = (rs("s_name") = username)
        if isUser then
            Response.Write "<script></script>"
            Response.Write "<tr class='highlight'>"
        else
            Response.Write "<tr>"
        end if

        Response.Write "<td>" & rs("rank") & "</td>"
        Response.Write "<td>" & rs("s_name") & "</td>"
        Response.Write "<td>" & rs("s_score") & "</td>"
        Response.Write "<td>" & rs("s_time") & "</td>"
        Response.Write "</tr>"

        rs.MoveNext
        rowCount = rowCount + 1
    loop
%>
    </table>

    <div class="pagination">
<%
    ' 生成分页链接
    dim totalPages
    totalPages = Ceiling(totalUsers / pageSize)
    
    dim i
    for i = 1 to totalPages
        if i = page then
            Response.Write "<a href='ranking.asp?page=" & i & "&Username=" & Server.URLEncode(username) & "' class='active'>" & i & "</a>"
        else
            Response.Write "<a href='ranking.asp?page=" & i & "&Username=" & Server.URLEncode(username) & "'>" & i & "</a>"
        end if
    next
%>
    </div>
    <div class=buttonContainer>
        <a href="index.html"><button id="backToIndex">返回首页</button></a>
    </div>
</body>
</html>

<%
    ' 关闭数据库连接
    conn.Close
    set conn = nothing

    ' 返回向上取整的函数
    Function Ceiling(value)
        if value = int(value) then
            Ceiling = value
        else
            Ceiling = int(value) + 1
        end if
    End Function
%>
