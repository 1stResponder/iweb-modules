/*
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
define(["iweb/CoreModule"], function(Core) {
	return Ext.define(null, {
		extend: 'Ext.Window',
		
		title: "",
		message: "",
		
		cls:'apps-window x-message-box',
		
		referenceHolder:true,
		defaultListenerScope: true,
		
		height: 180, width: 400,
		
		
		layout: {type: 'vbox', align: 'stretch'},
		closeAction: 'destroy',
		resizable: false,
		constrain: true,
		
		items: [{
			xtype: 'container',
			layout: 'hbox',
			padding: 10,
			style: {
				overflow: 'hidden'
			},
			items: [{
				xtype: 'box',
				cls: "x-message-box-icon x-message-box-info"
			},{
				xtype: 'box',
				reference: "box",
				flex:1
			}]
		}],
		buttonAlign: 'center',
		buttons: [{  
			text: "Reset Tool",
			reference: "reset",
			handler: "onButtonClick"
		},{
			text: "Clear",
			reference: "clear",
			handler: "onButtonClick"
		}],
		
		initComponent: function() {
			this.callParent();
			this.lookupReference('box').setHtml(this.message);
		},
		
		onButtonClick: function(btn) {
			Ext.callback(this.callback, this.scope || this, [btn.reference]);
		},
		
		listeners: {
			close: function() {
				Ext.callback(this.callback, this.scope || this, ['cancel']);	
			}
		}
	});
});
