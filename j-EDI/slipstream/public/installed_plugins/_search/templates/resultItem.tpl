<div class="search-result">
    <div class="title">
		<span class="object-name">{{{objectName}}}</span> |
		<span class="object-type">{{typeName}}</span> |
		<span class="domain-name">{{domainName}}</span>
    </div>
	<div class="object-description">
	    <div class="shortDescription">
	        {{{objectDescription}}}
	    </div>
	    {{#hasMore}}
	      <a class="more-description">{{more_link_text}}</a>
	      <div class="long-description" style="display:none">
	          {{{longDescription}}}
	      </div>
	      <a class="less-description" style="display:none">{{less_link_text}}</a>
	   {{/hasMore}}
	</div>
</div>
