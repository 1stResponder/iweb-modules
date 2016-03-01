/**
 * Copyright (c) 2008-2015, Massachusetts Institute of Technology (MIT)
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
package edu.mit.ll.iweb.websocket;

import org.apache.camel.CamelContext;
import org.apache.camel.component.rabbitmq.RabbitMQEndpoint;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.commons.configuration.Configuration;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.DefaultConfigurationBuilder;

public class Config {

	private static final String CONFIG_XML = "/config.xml";
	private Configuration config;
	private RabbitMQEndpoint endpoint;
	
	private String ROUTING_KEY = "iweb.#";
	private String EXCHANGE_NAME = "iweb.amq.topic";

    public static final String RABBIT_HOSTNAME_KEY = "rabbitmq.hostname";
    public static final String RABBIT_USERNAME_KEY = "rabbitmq.username";
    public static final String RABBIT_USERPWD_KEY = "rabbitmq.userpwd";
    public static final String RABBIT_EXCHANGENAME_KEY = "rabbitmq.exchange.name";
    public static final String RABBIT_MAX_CONN_TRIES = "rabbitmq.maxconntries";
    public static final String RABBIT_FAILOVER_HOSTNAME = "rabbitmq.failover.hostname";
    public static final String RABBIT_BINDING_KEYS = "rabbitmq.bindingkeys";
    public static final String RABBIT_MSG_VERSION = "rabbitmq.msgver";
	
	// Lazy-initialization Holder class idiom.
	private static class Holder {
		public static Config instance = new Config();
	}
	
	public static Config getInstance() {
		return Holder.instance;
	}
	
	public Configuration getConfiguration() {
		return config;
	}
	
	public RabbitMQEndpoint getRabbitMQEndpoint(){
		return endpoint;
	}
	
	private void initRabbitEndpoint(){
		CamelContext context = new DefaultCamelContext();
		
		//READ THESE FROM CONFIG
		endpoint = context.getEndpoint("rabbitmq://localhost:5672/iweb.amq.topic", RabbitMQEndpoint.class);
		endpoint.setUsername("guest");
		endpoint.setPassword("guest");
		endpoint.setExchangeType("topic");
		endpoint.setRoutingKey(ROUTING_KEY);
		endpoint.setExchangeName(EXCHANGE_NAME);
		/******************************************/
	}
	
	protected Config() {
		loadConfig();
	}

	private void loadConfig() {
		DefaultConfigurationBuilder builder = new DefaultConfigurationBuilder();
		builder.setURL(this.getClass().getResource(CONFIG_XML));	
		try {
			config = builder.getConfiguration(true);
			initRabbitEndpoint();
		} catch (ConfigurationException e) {
			String msg = "Could not find/read initialization file " + 
					CONFIG_XML + "Error: " +
					e.getCause().getLocalizedMessage();
			throw new ExceptionInInitializerError(msg);
		}	
	}	
}
