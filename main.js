	var saved_history=null
	var forwarded_history=null
	var msg_counter = 0
	var history_length = 0
	var portion = 100
	var history_pos = 0
	var history_forwarded = 0
	var history_forward_source = null
	function resendHistory(){
		document.getElementById('resend').disabled= true
		//var peer=JSON.parse(userlist.options[userlist.selectedIndex].value)
		var r=history_forward_source//r_with_peer(peer)
		r["_offset_id"]=0
		r["_offset_date"]=0
		r["_add_offset"]=history_pos
		r["_count"]=portion
		r["_max_id"]=0
		r["_min_id"]=0
		r["_hash"]=0
		get_history(r,get_history_forward_result)
		history_pos += portion
	}
	function get_history_forward_result(){
		history_length = (arguments[0].count != undefined)?arguments[0].count:arguments[0].messages[0]
	    history_forwarded += arguments[0].messages[0]
		if(history_length <= history_forwarded){
			document.getElementById('resend').disabled= true
		}
		//document.getElementById('resend').innerHTML="ReSend " + history_forwarded + " out of " + history_length
		document.getElementById('tgresult').appendChild(renderjson(arguments[0],"forward history"));
		forwarded_history = arguments[0]
		forwardHistory()
	}
	function forwardHistory(){
		if(forwarded_history != null){
			if(msg_counter == 0)msg_counter=forwarded_history.messages[0]
			var peer=JSON.parse(userlist.options[userlist.selectedIndex].value)
			var r=r_with_peer(peer)
			r["_flags"] = 0
			r["_msg_id"]=forwarded_history.messages[msg_counter].id
			r["_random_id"]=BigInt(Math.random().toString().substring(2))
//todo mark saved history type
			if(forwarded_history.chats[0]==1){
				if(forwarded_history.chats[1].access_hash == undefined){
					r["_from_peer"]=0x179be863
					r["_id_frompeer"]=forwarded_history.chats[1].id
				} else {
					r["_from_peer"]=0x20adaef8
					r["_id_frompeer"]=forwarded_history.chats[1].id
					r["_access_hash_frompeer"]=BigInt(forwarded_history.chats[1].access_hash)
				}
			}else{
				if(forwarded_history.messages[msg_counter].from_id == undefined){
					if(forwarded_history.chats[1].access_hash == undefined){
						r["_from_peer"]=0x179be863
						r["_id_frompeer"]=forwarded_history.chats[1].id
					} else {
						r["_from_peer"]=0x20adaef8
						r["_id_frompeer"]=forwarded_history.chats[1].id
						r["_access_hash_frompeer"]=BigInt(forwarded_history.chats[1].access_hash)
					}
					
				} else {
					for(var user_count=1;user_count<=forwarded_history.users[0];user_count++){
						if(forwarded_history.messages[msg_counter].from_id === forwarded_history.users[user_count].id ){
							r["_from_peer"]=0x7b8e7de6
							r["_id_frompeer"]=forwarded_history.users[user_count].id
							r["_access_hash_frompeer"]=BigInt(forwarded_history.users[user_count].access_hash)
							break
						}
					}
				}
			}
			send_history(r,forward_history_result)
		}
	}
	function forward_history_result(){
		document.getElementById('tgresult').appendChild(renderjson(arguments[0],"forward history element"));
		msg_counter--
		document.getElementById('resend').innerHTML="ReSend " + (history_forwarded-msg_counter) + " out of " + history_length
		if(msg_counter>0) { 
			forwardHistory()
		}  else {
			if(history_length <= history_forwarded){
				document.getElementById('resend').disabled= true
			} else {
				document.getElementById('resend').disabled= false
			}
		}
	}
	function reset_history_forward(){
		history_length = 0
		history_pos = 0
		history_forwarded = 0
		document.getElementById('resend').disabled= false
		document.getElementById('resend').innerHTML="ReSend "// + history_forwarded + " out of " + history_length
	}
	function sendHistory(){
		if(saved_history != null){
			if(msg_counter == 0)msg_counter=saved_history.messages[0]
			var peer=JSON.parse(userlist.options[userlist.selectedIndex].value)
			var r=r_with_peer(peer)
			r["_flags"] = 0
			r["_msg_id"]=saved_history.messages[msg_counter].id
			r["_random_id"]=BigInt(Math.random().toString().substring(2))
//todo mark saved history type
			if(saved_history.chats[0]==1){
				if(saved_history.chats[1].access_hash == undefined){
					r["_from_peer"]=0x179be863
					r["_id_frompeer"]=saved_history.chats[1].id
				} else {
					r["_from_peer"]=0x20adaef8
					r["_id_frompeer"]=saved_history.chats[1].id
					r["_access_hash_frompeer"]=BigInt(saved_history.chats[1].access_hash)
				}
			}else{
				if(saved_history.messages[msg_counter].from_id == undefined){
					if(saved_history.chats[1].access_hash == undefined){
						r["_from_peer"]=0x179be863
						r["_id_frompeer"]=saved_history.chats[1].id
					} else {
						r["_from_peer"]=0x20adaef8
						r["_id_frompeer"]=saved_history.chats[1].id
						r["_access_hash_frompeer"]=BigInt(saved_history.chats[1].access_hash)
					}
				} else {
					for(var user_count=1;user_count<=saved_history.users[0];user_count++){
						if(saved_history.messages[msg_counter].from_id === saved_history.users[user_count].id ){
							r["_from_peer"]=0x7b8e7de6
							r["_id_frompeer"]=saved_history.users[user_count].id
							r["_access_hash_frompeer"]=BigInt(saved_history.users[user_count].access_hash)
							break
						}
					}
				}
			}
			send_history(r,send_history_result)
		}
	}
	function send_history_result(){
		document.getElementById('tgresult').appendChild(renderjson(arguments[0],"send history element"));
		msg_counter--
		if(msg_counter>0) sendHistory()
	}
	function getStickerSet(){
//messages.getStickerSet#2619a90e stickerset:InputStickerSet = messages.StickerSet;
//inputStickerSetShortName#861cc8a0 short_name:string = InputStickerSet;
		call_tl_func({0:{tl_constructor:{uint4:0x2619a90e}},1:{inputStickerSetShortName:{uint4:0x861cc8a0}},2:{short_name:{string:"HotCherry"}}},getStickerSetResult)//messages.getStickers#43d4f2c emoticon:string hash:int = messages.Stickers;
	}
	function getStickerSetResult(){
		document.getElementById('tgresult').appendChild(renderjson(arguments[0],"getStickerSet"));
	}
	function gsl(){
		//messages.getStickers#43d4f2c emoticon:string hash:int = messages.Stickers;
		call_tl_func({0:{tl_constructor:{uint4:0x43d4f2c}},1:{emoticon:{string:new TextDecoder().decode(new Uint8Array([0xF0, 0x9F, 0x98, 0x81]))}},2:{hash:{uint4:0}}},getStiskersList)//messages.getStickers#43d4f2c emoticon:string hash:int = messages.Stickers;
	}
	function getStiskersList(){
		document.getElementById('tgresult').appendChild(renderjson(arguments[0],"stickers"));
		if(arguments[0].stickers != undefined && arguments[0].stickers[0] > 0){
			for(var stcount=1;stcount<=arguments[0].stickers[0];stcount++){
				if(arguments[0].stickers[stcount].mime_type == "application/x-tgsticker"){
					var peer=JSON.parse(userlist.options[userlist.selectedIndex].value)
					var r=r_with_peer(peer)
					r["_message_rnd_id"]=BigInt(Math.random().toString().substring(2))
					r["_id_st"]=arguments[0].stickers[stcount].id
					r["_access_hash_st"]=arguments[0].stickers[stcount].access_hash
					r["_file_reference"]=arguments[0].stickers[stcount].file_reference
					send_sticker(r,sendThumbsResult)
					break
				}
			}
		}
	}
	function sendThumbsResult(){
		document.getElementById('tgresult').appendChild(renderjson(arguments[0],"send Sticker result"));
//		document.getElementById('tgresult').appendChild(renderjson(JSON.parse(String.fromCharCode(...inflate(arguments[0].bytes.slice(10)))),"thumb decoded from 'get Sticker thumb.bytes'"));
	}
	function getProfilePhoto(){
		var peer=JSON.parse(userlist.options[userlist.selectedIndex].value)
		if(peer.photo.dc_id != undefined){
			var r=r_with_peer(peer)
			r["_flags"]=0
			r["_volume_id"]=BigInt(peer.photo.photo_small.volume_id.replace("n",""))
			r["_local_id"]=peer.photo.photo_small.local_id
			r["_dc_id"] = peer.photo.dc_id
			r["_offset"] = 0
			r["_limit"] = 524288
			if(DCenable){
				if(peer.photo.dc_id == dataC){
						getFileProfilePhoto(r,profilr_photo_result)
				} else {
						getFileProfilePhotoDC(r,profilr_photo_result)
				}
			}else{
				getFileProfilePhoto(r,profilr_photo_result)
			}
		}
	}
	function profilr_photo_result(){
		document.getElementById('tgresult').appendChild(renderjson(arguments[0],"profile photo"));
		var x = document.getElementById("myImg");
		x.src= 'data:image/jpg;base64,'+btoa(String.fromCharCode(...new Uint8Array(arguments[0].bytes)))
	}
	function clearlog(){
		document.getElementById('tgresult').querySelectorAll('*').forEach(n => n.remove());
	}
	function getHistory(){
		var peer = JSON.parse(userlist.options[userlist.selectedIndex].value)
		history_forward_source = r_with_peer(peer)
		document.getElementById('history').innerHTML = "Get History from "+userlist.options[userlist.selectedIndex].text
		/*
		r["_offset_id"]=0
		r["_offset_date"]=0
		r["_add_offset"]=0
		r["_count"]=portion
		r["_max_id"]=0
		r["_min_id"]=0
		r["_hash"]=0
		get_history(r,get_history_result)
		*/
	}
	function get_history_result(){
		document.getElementById('tgresult').appendChild(renderjson(arguments[0],"get history"));
		saved_history = arguments[0]
	}
	function sendSmile(){
		var peer=JSON.parse(userlist.options[userlist.selectedIndex].value)
		var r=r_with_peer(peer)
		r["_message"]=new TextDecoder().decode(new Uint8Array([0xF0, 0x9F, 0x98, 0x81]))
		r["_message_rnd_id"]=BigInt(Math.random().toString().substring(2))
		send_textmessage(r,send_textmessage_result)
	}
	function sendMessage(){
		var peer=JSON.parse(userlist.options[userlist.selectedIndex].value)
		var r=r_with_peer(peer)
		r["_message"]="text message"
		r["_message_rnd_id"]=BigInt(Math.random().toString().substring(2))
		send_textmessage(r,send_textmessage_result)
	}
	function send_textmessage_result(){
		document.getElementById('tgresult').appendChild(renderjson(arguments[0],"send text message"));
	}
	function sendMedia(){
		var peer=JSON.parse(userlist.options[userlist.selectedIndex].value)
		var r=r_with_peer(peer)
		r["_URL"]="i.gifer.com/6D.gif"
		r["_q"]=""
		r["_message"]="message about GIF"
		r["_message_rnd_id"]=BigInt(Math.random().toString().substring(2))
		send_external_GIF(r,send_external_GIF_result)
	}
	function send_external_GIF_result(){
		document.getElementById('tgresult').appendChild(renderjson(arguments[0],"send external GIF"));
	}
	function logout(){
		document.getElementById('tgresult').appendChild(renderjson(arguments[0],"logOut"));
	}
	function get_contacts(){
		document.getElementById('tgresult').appendChild(renderjson(arguments[0],"get Contacts"));
	}	
	function cv(){
		var t_array = readArrayFromString("messages.getUnreadMentions 	Get unread messages where we were mentionedmessages.readHistory 	Marks message history as read.messages.readMentions 	Mark mentions as readmessages.readMessageContents 	Notifies the sender about the recipient having listened a voice message or watched a video.messages.receivedMessages 	Confirms receipt of messages by a client, cancels PUSH-notification sending.messages.search 	Gets back found messagesmessages.searchGlobal 	Search for messages and peers globallymessages.sendMedia 	Send a mediamessages.sendMessage 	Sends a message to a chatmessages.sendMultiMedia 	Send an album of mediamessages.updatePinnedMessage 	Pin a messageWorking with notification settingsName 	Descriptionaccount.registerDevice 	Register device to receive PUSH notificationsaccount.unregisterDevice 	Deletes a device by its token, stops sending PUSH-notifications to it.account.updateDeviceLocked 	When client-side passcode lock feature is enabled, will not show message texts in incoming PUSH notifications.account.getNotifyExceptions 	Returns list of chats with non-default notification settingsaccount.getNotifySettings 	Gets current notification settings for a given user/group, from all users/all groups.account.updateNotifySettings 	Edits notification settings from a given user/group, from all users/all groups.account.resetNotifySettings 	Resets all notification settings from users and groups.Working with other usersName 	Descriptionusers.getFullUser 	Returns extended user info by ID.users.getUsers 	Returns basic user info according to their identifiers.Working with paymentsName 	Descriptionpayments.getSavedInfo 	Get saved payment informationpayments.clearSavedInfo 	Clear saved payment informationpayments.getPaymentForm 	Get a payment formpayments.validateRequestedInfo 	Submit requested order information for validationmessages.setBotShippingResults 	If you sent an invoice requesting a shipping address and the parameter is_flexible was specified, the bot will receive an updateBotShippingQuery update. Use this method to reply to shipping queries.account.getTmpPassword 	Get temporary payment passwordpayments.sendPaymentForm 	Send compiled payment formmessages.setBotPrecheckoutResults 	Once the user has confirmed their payment and shipping details, the bot receives an updateBotPrecheckoutQuery update.Use this method to respond to such pre-checkout queries.Note: Telegram must receive an answer within 10 seconds after the pre-checkout query was sent.payments.getPaymentReceipt 	Get payment receiptWorking with pollsName 	Descriptionmessages.getPollResults 	Get poll resultsmessages.sendVote 	Vote in a pollWorking with scheduled messagesName 	Descriptionmessages.sendScheduledMessages 	Send scheduled messages right awaymessages.getScheduledHistory 	Get scheduled messagesmessages.deleteScheduledMessages 	Delete scheduled messagesmessages.getScheduledMessages 	Get scheduled messagesWorking with sensitive content (NSFW)Name 	Descriptionaccount.getContentSettings 	Get sensitive content settingsaccount.setContentSettings 	Set sensitive content settings (for viewing or hiding NSFW content)Working with sponsored proxiesName 	Descriptionhelp.getProxyData 	Get promotion info of the currently-used MTProxyWorking with stickersName 	Descriptionstickers.addStickerToSet 	Add a sticker to a stickerset, bots only. The sticker set must have been created by the bot.stickers.changeStickerPosition 	Changes the absolute position of a sticker in the set to which it belongs; for bots only. The sticker set must have been created by the botstickers.createStickerSet 	Create a stickerset, bots only.stickers.removeStickerFromSet 	Remove a sticker from the set where it belongs, bots only. The sticker set must have been created by the bot.messages.clearRecentStickers 	Clear recent stickersmessages.faveSticker 	Mark a sticker as favoritemessages.getAllStickers 	Get all installed stickersmessages.getArchivedStickers 	Get all archived stickersmessages.getAttachedStickers 	Get stickers attached to a photo or videomessages.getFavedStickers 	Get faved stickersmessages.getFeaturedStickers 	Get featured stickersmessages.getMaskStickers 	Get installed mask stickersmessages.getRecentStickers 	Get recent stickersmessages.getStickerSet 	Get info about a stickersetmessages.getStickers 	Get stickers by emojimessages.saveRecentSticker 	Add/remove sticker from recent stickers listmessages.installStickerSet 	Install a stickersetmessages.readFeaturedStickers 	Mark new featured stickers as readmessages.reorderStickerSets 	Reorder installed stickersetsmessages.searchStickerSets 	Search for stickersetsmessages.uninstallStickerSet 	Uninstall a stickersetWorking with the user's accountName 	Descriptionaccount.changePhone 	Change the phone number of the current accountaccount.confirmPhone 	Confirm a phone number to cancel account deletion, for more info click here »account.deleteAccount 	Delete the user's account from the telegram servers. Can be used, for example, to delete the account of a user that provided the login code, but forgot the 2FA password and no recovery method is configured.account.getAccountTTL 	Get days to live of accountaccount.getPrivacy 	Get privacy settings of current accountaccount.resetAuthorization 	Log out an active authorized session by its hashaccount.sendChangePhoneCode 	Verify a new phone number to associate to the current accountaccount.sendConfirmPhoneCode 	Send confirmation code to cancel account deletion, for more info click here »account.setAccountTTL 	Set account self-destruction periodaccount.setPrivacy 	Change privacy settings of current accountaccount.updateProfile 	Updates user profile.account.updateStatus 	Updates online user status.Working with user profile picturesName 	Descriptionphotos.deletePhotos 	Deletes profile photos.photos.getUserPhotos 	Returns the list of user photos.photos.updateProfilePhoto 	Installs a previously uploaded photo as a profile photo.photos.uploadProfilePhoto 	Updates current user profile photo.Working with usernamesName 	Descriptionchannels.checkUsername 	Check if a username is free and can be assigned to a channel/supergroupchannels.updateUsername 	Change the username of a supergroup/channelaccount.updateUsername 	Changes username for the current user.account.checkUsername 	Validates a username and checks availability.contacts.resolveUsername 	Resolve a @username to get peer infoWorking with wallpapersName 	Descriptionaccount.getMultiWallPapers 	Get info about multiple wallpapersaccount.getWallPaper 	Get info about a certain wallpaperaccount.getWallPapers 	Returns a list of available wallpapers.account.installWallPaper 	Install wallpaperaccount.resetWallPapers 	Delete installed wallpapersaccount.saveWallPaper 	Install/uninstall wallpaperaccount.uploadWallPaper 	Create and upload a new wallpaperTelegramTelegram is a cloud-based mobile and desktop messaging app with a focus on security and speed.About    FAQ    Blog    JobsMobile Apps    iPhone/iPad    Android    Windows PhoneDesktop Apps    PC/Mac/Linux    macOS    Web-browserPlatform    API    Translations    Instant View")
		var r = {}
		r["_file_data_array"] = t_array
		r["_file_name"]="filename.txt"
		r["_file_data_type"]="text/plain"
		r["_file_random_id"]=BigInt(Math.random().toString().substring(2))
		saveFile(r,is_filesaved)
	}
	function is_filesaved(){
		var peer=JSON.parse(userlist.options[userlist.selectedIndex].value)
		var r=r_with_peer(peer)
		r["_MD5"]=arguments[0]
		r["_blocks"]=arguments[1]
		r["_filename"]=arguments[2]
		r["_datatype"]=arguments[3]
		r["_file_length"]=arguments[4]
		r["_file_random_id"]=arguments[5]
		r["_message"]="message about file"
		r["_message_rnd_id"]=BigInt(Math.random().toString().substring(2))
		send_saved_mediaFile(r,send_saved_result)
	}
	function send_saved_result(){
		document.getElementById('tgresult').appendChild(renderjson(arguments[0],"send Saved File result"));
	}
