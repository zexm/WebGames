function reply_at(username) {
  var obj = document.getElementById('comment_text');
  if (obj) {
    insertAtCursor(obj, "@" + username + ": ");
    $(obj).focus();
  } else {
    alert("发表评论需要登录本站");
  }
}

function reply_talk_at(username) {
  var obj = document.getElementById('sms');
  if (obj) {
    $(obj).val("");
    insertAtCursor(obj, "@" + username + ": ");
    $(obj).focus();
  }
}

function sendsms() {
  if (typeof(g_logged_in_id) == "undefined")
    alert("登录以后才能发消息");
  $.post("/youxi/talk/send/",
      {'content':$("#sms").val()},
      function(data){ /*update_talks_with_data(data);*/ });
  $("#sms").val("");
}

function setup_listen_for_talks() {
  //first setup for 3 seconds sync time
  if (!document.getElementById("talked"))
      return;
  last_talk_id = 0;
  update_talks(/*noblink=*/true);
  interval = setInterval("update_talks()", 8000);
  $("#sendsms").click(sendsms);
  $("#sms").keydown(function(eve){
    if (eve.target == this && eve.keyCode == 13) {
      eve.preventDefault();
      sendsms();
      this.returnValue = false;
    }
  });
}

function refresh_time_tags(curr_tag) {
  $(".time_tag").each(function(){
    var tag = parseInt($(this).attr("tag"), 10);
    var diff = curr_tag - tag;
    var time_str = "";
    if (diff / 86400 >= 1) {
      time_str = (diff/86400).toFixed(1) + "天前";
    } else if (diff / 3600 >= 1) {
      time_str = (diff/3600).toFixed(1) + "小时前";
    } else if (diff / 60 >= 1) {
      time_str = (diff/60).toFixed(0) + "分钟前";
    } else {
      time_str = diff + "秒前!";
    }
    $(this).text(time_str);
  });
}
function clear_blink(oldTitle) {
  clearInterval(g_timeout_id);
  g_timeout_id = null;
  document.title = oldTitle;
  document.onmousemove = null;
  document.onkeydown = null;
}
function blink_info(msg) {
  var oldTitle = document.title;
  if (typeof(g_timeout_id) != "undefined" && g_timeout_id) {
    clearInterval(g_timeout_id);
  }
  g_timeout_id = setInterval(function() {
      document.title = document.title == msg ? ' ' : msg;
    }, 500);
  document.onmousemove = function() { clear_blink(oldTitle); };
  document.onkeydown = function() { clear_blink(oldTitle); };
}
function update_talks_with_data(data, noblink) {
  talks = [];
  eval(data); //here we got 'talks' and 'time_tag' refreshed
  str = "";
  var has_chat = false;
  for (var i=0; i<talks.length; i++) {
    var t = talks[i];
    var is_mine = typeof(g_logged_in_id) != "undefined" && g_logged_in_id == t.uid;
    str += '<div class="';
    if (t.content.length >= 2 && ">>" == t.content.substring(0, 2))
      str += 'systemitem';
    else {
      has_chat = true;
      str += 'chatitem';
      if (is_mine)
        str += ' mychatitem';
    }
    str += '"><a href="/youxi/user/' + t.uid + '/">' + t.uname + '</a>';
    str += ' @ <span class="time_tag" tag="' + t.time + '">&nbsp;</span>';
    if (!is_mine)
      str += ' <a href="#" onclick="reply_talk_at(\'' + t.uname + '\');return false;">回复</a>';
    str += '<br/>' + t.content + '</div>';
    last_talk_id = t.id;
  }
  if (str) {
    $(str).insertBefore("#sms_end");
    var obj = document.getElementById("talked");
    obj.scrollTop = obj.scrollHeight;
    if (has_chat && (typeof(noblink) == 'undefined' || !noblink))
      blink_info("【新聊天消息】");
  }
  refresh_time_tags(time_tag);
}

function update_talks(noblink) {
  var url = "/youxi/talk/update/" + last_talk_id + "/" + new Date().getTime() + "/";
  $.post(url, function(data){ update_talks_with_data(data, noblink); });
}

function submit_comment() {
  var comment = $("#comment_text").val();
  $("#comment_form input").attr("disabled", "true");
  $.ajax({
    type: "POST",
    dataType: 'text',
    url: "./comment/",
    data: {'comment':comment},
    success: function(msg){
      var rtn = eval(msg);
      if (rtn.result == 'F') {
        $("#comment_error").html(rtn['error_msg']);
      } else {
        cmt = rtn.cmt;
        var comment_html = '<tr id="' + cmt.id + '" class="comment">';
        comment_html += '<td class="lou">' + cmt.total + '</td>';
        comment_html += '<td class="comment_info">';
        comment_html += '<a href= "/youxi/user/' + cmt.user_id + '/">' + cmt.user_name + '</a>';
        comment_html += cmt.create_time + '<a href="#comment_form">回复</a>';
        comment_html += '<br />';
        comment_html += '<div class="comment_content" style="font-size:medium">';
        comment_html += '<code>' + cmt.content + '</code>';
        comment_html += '</div></td></tr>';
        $("#comments").append(comment_html);

        $("#comment_text").val('');
      }
      $("#comment_form input").removeAttr("disabled");
    },
    error: function(msg){
      /*alert('操作失败:' + msg);*/
      $("#comment_form input").removeAttr("disabled");
    }
  });
}

function init_home_tabs() {
  //click Event for all tabs:
  $('.tabs li').hover(function(){
      $(".tab").css('display','none');
      $(".tabs li").removeClass('selected');
      $(this).addClass('selected');
      $('#'+this.childNodes[0].href.split('#')[1]).fadeIn('slow');
      return false;
      });
  //set first tab active
  $('.tabs li').eq(0).hover();
}

$(document).ready(function() {
  setup_listen_for_talks();
});

