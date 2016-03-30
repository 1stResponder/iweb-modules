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
package edu.mit.ll.iweb.rabbit;

import java.util.Iterator;
import java.util.List;

import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.PerRequestBroadcastFilter;

import edu.mit.ll.iweb.message.MessageEncoder;
import edu.mit.ll.iweb.message.ResponseMessage;

public class RabbitBroadcastFilter implements PerRequestBroadcastFilter {
    /**
     * Transform or Filter a message per request, with V as an indicator. Be careful when setting headers on the
     * {@link AtmosphereResponse} as the headers may have been already sent back to the browser.
     *
     *
     * @param atmosphereResource
     * @param message  Object a message
     * @param originalMessage The original message that was broadcasted.
     * @return a transformed message.
     */

	@Override
	public BroadcastAction filter(String arg0, Object message, Object arg2) {
		return (new BroadcastAction(BroadcastAction.ACTION.CONTINUE,message));
	}

	@Override
	public BroadcastAction filter(String broadcasterId, AtmosphereResource r, Object originalMessage, Object message){
		try{
			ResponseMessage response = ((ResponseMessage) originalMessage);
			
			List<String> topics = (List<String>) r.getRequest().getSession().getAttribute("topics");
			String topic = response.getEventName();
			
			if(findMatch(topics,topic)){
				return (new BroadcastAction(BroadcastAction.ACTION.CONTINUE,new MessageEncoder().encode(response)));
			}
			return (new BroadcastAction(BroadcastAction.ACTION.ABORT, null));
		}catch(Exception e){
			//Response not formatted correctly
			return (new BroadcastAction(BroadcastAction.ACTION.ABORT, null));
		}
	};
	
	private boolean findMatch(List<String> topics, String topic){
		for(Iterator<String> itr = topics.iterator(); itr.hasNext();){
			String subscribedTopic = itr.next();
			if(subscribedTopic.indexOf("#") != -1){
				if(topic.matches(subscribedTopic.replace("#", "(.*)"))){
					return true;
				}
			}else if(subscribedTopic.equals(topic)){
				return true;
			}
		}
		return false;
	}
}
