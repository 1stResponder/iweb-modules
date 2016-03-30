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
 define(['iweb/CoreModule', './SampleTabController'],
         	function (Core, SampleTabController){
	Ext.define('modules.sample-tab.SampleTabViewer', {

		extend: 'Ext.tab.Panel',
		
		controller: 'sampletabcontroller',

		requires: [ 'Ext.tab.Panel', 'Ext.Panel', 'Ext.Button', 'Ext.form.TextField', 'Ext.Container' ],

		
		
		initComponent: function(){
			if(console){console.log('initComponent is being called on SampleViewer!');}
			
			// Create individual tabs to add here
			var helloGridViewer = Ext.create('modules.sample-tab-grid.GridViewer');
			var helloMessageViewer = Ext.create('modules.sample-tab-message.MessageViewer');
			
			this.callParent();
			
			this.addTab({title: 'HelloMessage', component: helloMessageViewer});
			this.addTab({title: 'Hello Grid', component: helloGridViewer});
		},
	
		config: {
			title: 'Sample Tabs',
			text : 'Sample Tabs',
			style: 'nontb_style',
			items: [
					{
						id: 'sampleSummaryPanel',
					    title: 'Simple Text',
					    bodyPadding: 10,
					    html: '<p>Static text tab panel.  Tab modules will populate the tabs above</p>'
					}
				 ]
			
		},		
	
		
		addTab: function(tab) {
			
		
			
			if(tab && tab.title && tab.component) {
				
				// Check to see if the component has a set title, and if not, set it to the
				// one specified
				if(!tab.component.title) {
					tab.component.title = tab.title;
				}
								
				this.add(tab.component);
				
				
				
			} else {
				if(console){console.log("SampleTabViewer: tab was either undefined, or missing a title: ",
						tab);}
			}
			
			
		}		
	
	});
});
