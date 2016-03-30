/**
 * Copyright (c) 2008-2016, Massachusetts Institute of Technology (MIT)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
package edu.mit.ll.iweb.session;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.core.Cookie;

import org.apache.commons.configuration.Configuration;

import edu.mit.ll.iweb.websocket.Config;

public final class SessionHolder{
	public static String TOKEN = "token";
	
	private static Map<String,Map<String,Object>> sessions = new HashMap<String,Map<String,Object>>();
	
	public static void addSession(String sessionId, Map<String,Object> sessionData){
		sessions.put(sessionId, sessionData);
	}
	
	public static Object getData(String sessionId, String key) {
		if(hasSession(sessionId) && sessions.get(sessionId).containsKey(key)){
			return sessions.get(sessionId).get(key);
		}
		return null;
		//throw no session error
		//throw no key error
	}
	
	public static Map<String,Object> getSessionInfo(String sessionId){
		return sessions.get(sessionId);
	}
	
	public static boolean hasSession(String sessionId){
		return sessions.containsKey(sessionId);
	}
	
	public static void removeSession(String sessionId){
		sessions.remove(sessionId);
	}
	
	public static Collection<Cookie> getCookieStore(
			Collection<String> cookieKeys, String value){
		Collection<Cookie> cookies = new ArrayList<Cookie>();
    	Configuration config = Config.getInstance().getConfiguration();
    	
    	for(String key : cookieKeys){
    		String cookieName = config.getString(key.concat(".key"));
    		String cookiePath = config.getString(key.concat(".path"));
    		String cookieDomain = config.getString(key.concat(".domain"));
    		
    		if(cookieName != null){
    			if(cookiePath != null && cookieDomain != null){
    				cookies.add(new Cookie(cookieName, value, cookiePath, cookieDomain));
    			}else{
    				cookies.add(new Cookie(cookieName, value));
    			}
    		}
    	}
        return cookies;
	}
}
