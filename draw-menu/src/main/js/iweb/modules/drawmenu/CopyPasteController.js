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
       extend: 'Ext.app.ViewController',
       
       clipboard: [],
       
       readOnly: false,
       
       init: function() {
    	  Core.EventManager.addListener("map-source-set", this.onMapSourceSet.bind(this));
    	  Core.EventManager.addListener("map-selection-change", this.onMapSelectionChange.bind(this));
       },
       
       onCopyClick: function() {
    	   this.clipboard = Core.Ext.Map.getEditableSelection().getArray().slice();
    	   this.disablePaste(this.readOnly);
       },
       
       onPasteClick: function() {
    	   
    	   var clones = this.clipboard.map(function(f) {
    		   var clone = f.clone();
    		   clone.setId(undefined);
    		   clone.unset("featureId");
    		   return clone;
    	   });
    	   Core.Ext.Map.getSource().addFeatures(clones);
    	   
    	   var selectCollection = Core.Ext.Map.getSelection();
    	   selectCollection.clear();
    	   selectCollection.extend(clones);
       },
       
       onMapSelectionChange: function(eventName, selection) {
         //use the editable selection rather than passed selection
         var editableSelection = Core.Ext.Map.getEditableSelection().getArray();
    	   this.lookupReference("copy").setDisabled(!editableSelection.length);
       },
       
       onMapSourceSet: function(eventName, oldSource, newSource){
    	   this.readOnly = (newSource == null);
    	   if(!this.readOnly && this.clipboard.length > 0){
    		   this.disablePaste(false);
    	   }else{
    		   this.disablePaste(true);
    	   }
       },
       
       disablePaste: function(disable){
    	   this.lookupReference("paste").setDisabled(disable);
       }
       
    });

});
