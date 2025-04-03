<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<%
    Response.ContentType = "application/json"
    
    ' 获取提交的数据
    dim s_name, s_score, s_time
    s_name = Request.Form("s_name")
    s_score = Request.Form("s_score")
    s_time = Request.Form("s_time")

    ' 打开数据库连接
    dim conn, sql, rs
    set conn = Server.CreateObject("ADODB.Connection")
    conn.Open "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" & Server.MapPath("score.mdb")

    ' 检查用户是否已有历史记录
    sql = "SELECT * FROM score WHERE s_name = '" & Replace(s_name, "'", "''") & "'"
    set rs = conn.Execute(sql)

    if rs.EOF then
        ' 用户没有历史记录，直接插入新的成绩
        sql = "INSERT INTO score (s_name, s_score, s_time) VALUES ('" & Replace(s_name, "'", "''") & "', '" & Replace(s_score, "'", "''") & "', '" & Replace(s_time, "'", "''") & "')"
        conn.Execute(sql)
        Response.Write "{""success"": true, ""message"": ""成绩提交成功！首次记录已保存。""}"

    else
        ' 存在历史记录，进行比较
        dim oldScore, oldTime
        oldScore = rs("s_score")
        oldTime = rs("s_time")

        ' 转换时间字符串为分钟数便于比较
        dim newTimeMinutes, oldTimeMinutes
        newTimeMinutes = convertTimeToMinutes(s_time)
        oldTimeMinutes = convertTimeToMinutes(oldTime)

        if CInt(s_score) > CInt(oldScore) or (CInt(s_score) = CInt(oldScore) and newTimeMinutes < oldTimeMinutes) then
            ' 新分数更高，或者分数相同但作答时间更短，更新记录
            sql = "UPDATE score SET s_score = '" & Replace(s_score, "'", "''") & "', s_time = '" & Replace(s_time, "'", "''") & "' WHERE s_name = '" & Replace(s_name, "'", "''") & "'"
            conn.Execute(sql)
            Response.Write "{""success"": true, ""message"": ""成绩更新成功！新记录已保存。""}"
        else
            ' 新记录没有超越历史成绩，不更新
            Response.Write "{""success"": false, ""message"": ""成绩未更新，历史记录更优。""}"
        end if
    end if

    ' 关闭数据库连接
    conn.Close
    set conn = nothing

    ' 将作答时间转换为分钟数的函数
    Function convertTimeToMinutes(timeStr)
        dim timeParts, minutes, seconds
        timeParts = Split(timeStr, " 分钟 ")
        minutes = CInt(timeParts(0))

        ' 检查是否有秒数
        if UBound(timeParts) > 0 then
            seconds = CInt(Replace(timeParts(1), " 秒", ""))
            minutes = minutes + seconds / 60
        end if

        convertTimeToMinutes = minutes
    End Function
%>
