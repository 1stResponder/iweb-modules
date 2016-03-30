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
define(['iweb/CoreModule'], 

	function(Core ){
	
		Ext.define('modules.sample-tab-grid.GridController', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.gridcontroller',
			
			init: function(){
				this.bindEvents();
			},
			bindEvents: function(){
				Core.EventManager.addListener("iweb.sample-tab.message", this.onSortMessage.bind(this));
				
			},
			onSortMessage: function(e, message) {
				//Split string on blank space, and build hash table of words and wordcounts
				var wordCount = new Array();
				var gridData = new Array();
				var res = message.split(/\s+/); 
				var arrayLength = res.length;
				for (var i = 0; i < arrayLength; i++) {
				
						if (typeof wordCount[res[i]] == "undefined"){
							wordCount[res[i]] = 1;
						}
						else {
							++wordCount[res[i]];
						}
						
					  
				}
					// Create array, and load it in the grid 
					for (word in wordCount) {
						var thisRow = [word,wordCount[word]];
						gridData.push(thisRow);
					}
					
					this.view.store.loadData(gridData);
				}
	});
});
