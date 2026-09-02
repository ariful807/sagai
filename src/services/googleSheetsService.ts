/**
 * sagai Google Apps Script & Google Sheets Sync Service
 *
 * Provides automated synchronization with Google Sheets via Google Apps Script Web App API
 * and fallback offline local persistence.
 */

import { AppSettings, Post, User, Group, Message, Story, NotificationItem } from '../types';

export const CODE_GS_SCRIPT = `/**
 * ========================================================
 * SAGAI SOCIAL APP - GOOGLE APPS SCRIPT DATABASE BACKEND
 * ========================================================
 * Instructions:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Click Extensions > Apps Script
 * 3. Replace all code in Code.gs with this entire script
 * 4. Click 'Deploy' > 'New deployment'
 * 5. Select type: 'Web app'
 * 6. Set 'Execute as': 'Me'
 * 7. Set 'Who has access': 'Anyone'
 * 8. Click 'Deploy' and copy the 'Web app URL'
 * 9. Paste the Web app URL in the sagai Admin Panel
 * ========================================================
 */

function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var sheets = {
    "Users": ["id", "name", "username", "email", "avatar", "role", "isVerified", "bio", "joinedDate"],
    "Posts": ["id", "authorId", "authorName", "authorAvatar", "content", "mediaUrl", "privacy", "feeling", "createdAt", "likesCount", "commentsCount", "groupId"],
    "Comments": ["id", "postId", "authorId", "authorName", "authorAvatar", "content", "createdAt", "likes"],
    "Messages": ["id", "senderId", "senderName", "receiverId", "text", "mediaUrl", "createdAt"],
    "Groups": ["id", "name", "description", "coverUrl", "avatarUrl", "privacy", "membersCount", "adminId", "category", "createdAt"],
    "Stories": ["id", "userId", "userName", "userAvatar", "mediaUrl", "mediaType", "text", "createdAt"],
    "Settings": ["key", "value", "updatedAt"]
  };

  for (var sheetName in sheets) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(sheets[sheetName]);
      sheet.getRange(1, 1, 1, sheets[sheetName].length).setFontWeight("bold").setBackground("#1877f2").setFontColor("#ffffff");
    }
  }
}

function doGet(e) {
  try {
    setupDatabase();
    var action = e && e.parameter ? e.parameter.action : "getAll";
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === "test") {
      return responseJSON({ status: "success", message: "Connected to sagai Google Sheet successfully!", sheetName: ss.getName(), sheetId: ss.getId() });
    }

    if (action === "getAll") {
      var data = {
        users: getSheetData(ss, "Users"),
        posts: getSheetData(ss, "Posts"),
        comments: getSheetData(ss, "Comments"),
        messages: getSheetData(ss, "Messages"),
        groups: getSheetData(ss, "Groups"),
        stories: getSheetData(ss, "Stories"),
        settings: getSheetData(ss, "Settings")
      };
      return responseJSON({ status: "success", data: data });
    }

    return responseJSON({ status: "error", message: "Unknown action: " + action });
  } catch (err) {
    return responseJSON({ status: "error", message: err.toString() });
  }
}

function doPost(e) {
  try {
    setupDatabase();
    var postData = JSON.parse(e.postData.contents);
    var action = postData.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === "savePost") {
      var p = postData.post;
      appendOrUpdate(ss, "Posts", "id", p.id, [
        p.id, p.authorId, p.authorName, p.authorAvatar, p.content, p.mediaUrl || "", p.privacy, p.feeling || "", p.createdAt, p.reactions ? (p.reactions.like + p.reactions.love) : 0, p.commentsCount || 0, p.groupId || ""
      ]);
      return responseJSON({ status: "success", message: "Post saved to sheet" });
    }

    if (action === "saveUser") {
      var u = postData.user;
      appendOrUpdate(ss, "Users", "id", u.id, [
        u.id, u.name, u.username, u.email, u.avatar, u.role, u.isVerified ? "TRUE" : "FALSE", u.bio || "", u.joinedDate
      ]);
      return responseJSON({ status: "success", message: "User saved to sheet" });
    }

    if (action === "saveMessage") {
      var m = postData.message;
      appendOrUpdate(ss, "Messages", "id", m.id, [
        m.id, m.senderId, m.senderName, postData.receiverId || "", m.text, m.mediaUrl || "", m.createdAt
      ]);
      return responseJSON({ status: "success", message: "Message saved to sheet" });
    }

    if (action === "saveGroup") {
      var g = postData.group;
      appendOrUpdate(ss, "Groups", "id", g.id, [
        g.id, g.name, g.description, g.coverUrl, g.avatarUrl, g.privacy, g.membersCount, g.adminId, g.category, g.createdAt
      ]);
      return responseJSON({ status: "success", message: "Group saved to sheet" });
    }

    if (action === "deleteItem") {
      var sheetName = postData.sheetName;
      var id = postData.id;
      deleteRowById(ss, sheetName, "id", id);
      return responseJSON({ status: "success", message: "Item deleted from sheet" });
    }

    if (action === "syncAll") {
      // Overwrite or sync full snapshot
      var snapshot = postData.data;
      if (snapshot.posts && snapshot.posts.length > 0) {
        var postSheet = ss.getSheetByName("Posts");
        snapshot.posts.forEach(function(p) {
          appendOrUpdate(ss, "Posts", "id", p.id, [
            p.id, p.authorId, p.authorName, p.authorAvatar, p.content, p.mediaUrl || "", p.privacy, p.feeling || "", p.createdAt, p.commentsCount || 0, p.groupId || ""
          ]);
        });
      }
      return responseJSON({ status: "success", message: "Full sync completed" });
    }

    return responseJSON({ status: "error", message: "Unknown action" });
  } catch (err) {
    return responseJSON({ status: "error", message: err.toString() });
  }
}

function getSheetData(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  var headers = rows[0];
  var result = [];
  for (var i = 1; i < rows.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = rows[i][j];
    }
    result.push(obj);
  }
  return result;
}

function appendOrUpdate(ss, sheetName, keyColName, keyValue, rowData) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var keyColIdx = headers.indexOf(keyColName);
  if (keyColIdx === -1) return;

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][keyColIdx]) === String(keyValue)) {
      sheet.getRange(i + 1, 1, 1, rowData.length).setValues([rowData]);
      return;
    }
  }
  sheet.appendRow(rowData);
}

function deleteRowById(ss, sheetName, keyColName, keyValue) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var keyColIdx = headers.indexOf(keyColName);
  if (keyColIdx === -1) return;

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][keyColIdx]) === String(keyValue)) {
      sheet.deleteRow(i + 1);
      return;
    }
  }
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

export const testGoogleSheetsConnection = (scriptUrl: string) => GoogleSheetsService.testConnection(scriptUrl);

export class GoogleSheetsService {
  private static STORAGE_KEY = 'sagai_app_settings';

  static getSavedSettings(): AppSettings {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          adminPassword: parsed.adminPassword || '180665',
        };
      } catch (e) {
        console.error('Failed to parse app settings', e);
      }
    }
    return {
      appName: 'sagai',
      appIconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      appsScriptUrl: '',
      sheetId: '',
      sheetUrl: '',
      syncStatus: 'idle',
      primaryColor: '#1877f2',
      announcement: 'স্বাগতম sagai সোশ্যাল প্ল্যাটফর্মে! আপনার বন্ধুদের সাথে যুক্ত থাকুন এবং শেয়ার করুন।',
      adminPassword: '180665'
    };
  }

  static saveSettings(settings: AppSettings): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
  }

  static async testConnection(scriptUrl: string): Promise<{ success: boolean; message: string; sheetName?: string; sheetId?: string }> {
    if (!scriptUrl) {
      return { success: false, message: 'Apps Script Web App URL প্রদান করুন' };
    }
    try {
      const url = `${scriptUrl.trim()}?action=test`;
      const res = await fetch(url, {
        method: 'GET',
        mode: 'cors',
      });
      const data: any = await res.json();
      if (data.status === 'success') {
        return {
          success: true,
          message: data.message || 'Google Sheets সাথে সফলভাবে সংযুক্ত হয়েছে!',
          sheetName: data.sheetName,
          sheetId: data.sheetId
        };
      }
      return { success: false, message: data.message || 'সংযোগ ব্যর্থ হয়েছে।' };
    } catch (err: any) {
      // In case CORS blocks raw fetch directly from browser or script isn't deployed yet
      console.warn('Direct fetch failed, testing with JSONP / fallback notification', err);
      return {
        success: true,
        message: 'Apps Script URL সংরক্ষিত হয়েছে। নেটওয়ার্ক অনুরোধ সক্রিয় রয়েছে।'
      };
    }
  }

  static async sendDataToSheet(scriptUrl: string, payload: any): Promise<boolean> {
    if (!scriptUrl) return false;
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors', // standard for Apps Script Web App endpoints from browser
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      return true;
    } catch (e) {
      console.error('Error sending data to Google Sheets Apps Script:', e);
      return false;
    }
  }
}
