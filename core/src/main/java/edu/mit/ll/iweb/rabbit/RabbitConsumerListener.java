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

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.log4j.Logger;
import org.atmosphere.cpr.Broadcaster;
import org.apache.camel.component.rabbitmq.RabbitMQConstants;

import edu.mit.ll.iweb.message.ResponseMessage;


/**
 * @version $Revision:st23420$
 */
public class RabbitConsumerListener implements Processor {
	private static Logger logger = Logger.getLogger(RabbitConsumerListener.class);
	
	private Broadcaster defaultBroadcaster;
	
	/**
	 * Listener for the Mediator endpoint
	 * @param topicPattern
	 * @param username
	 * @param password
	 * @param broadcaster
	 */
	public RabbitConsumerListener(Broadcaster broadcaster){
		this.defaultBroadcaster = broadcaster;
	}

	@Override
	public void process(Exchange exchange) throws Exception {
		ResponseMessage response = new ResponseMessage(
				(String) exchange.getIn().getHeader(RabbitMQConstants.ROUTING_KEY), //topic
				new String(exchange.getIn().getBody(byte[].class))); //message
		
		this.defaultBroadcaster.broadcast(response);
	}
}
