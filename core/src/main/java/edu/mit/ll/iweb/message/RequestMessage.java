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
package edu.mit.ll.iweb.message;

import java.util.Collection;

public class RequestMessage {

    private String type;
    private String topic;
    private String message;
    private String url;
    private String eventName;
    private String payload;
    private String responseType;
    private Collection<String> cookieKeys;
    private int userId;

    public RequestMessage(){}

    public String getType(){
    	return type;
    }
    
    public void setType(String type){
    	this.type = type;
    }
    
    public String getTopic(){
    	return topic;
    }
    
    public void setTopic(String topic){
    	this.topic = topic;
    }
    
    public String getMessage(){
    	return message;
    }
    
    public void setMessage(String message){
    	this.message = message;
    }
    
    public String getUrl(){
    	return url;
    }
    
    public void setUrl(String url){
    	this.url = url;
    }
    
    public String getEventName(){
    	return this.eventName;
    }
    
    public void setEventName(String eventName){
    	this.eventName = eventName;
    }
    
    public void setPayload(String payload){
    	this.payload = payload;
    }
    
    public String getPayload(){
    	return this.payload;
    }
    
    public int getUserId(){
    	return this.userId;
    }
    
    public void setUserId(int userId){
    	this.userId = userId;
    }
    
    public void setResponseType(String responseType){
    	this.responseType = responseType;
    }
    
    public String getResponseType(){
    	return this.responseType;
    }
    
    public Collection<String> getCookieKeys(){
    	return this.cookieKeys;
    }
    
    public void setCookieKeys(Collection<String> keys){
    	this.cookieKeys = keys;
    }
}
