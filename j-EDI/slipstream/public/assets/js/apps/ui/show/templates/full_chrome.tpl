<!-- Top nav bar-->
<!--<div class="top-bar-region">-->
<div>
    <nav class="top-bar" data-topbar>
        <div class="row">
            <div class="left">
                <section class="top-bar-section logo-section">
                    <a href="{{logo_link}}">
                        <img class="burst" src="/assets/images/icon_space_burst.svg">
                    </a>
                    <a href="#">
                        <img src="{{logo_src}}" style="height: {{logo_height}}; width:{{logo_width}};">
                    </a>
                </section>
            </div>

            <!--
            <div class="left small-2 medium-2 large-3 columns">
                <section class="top-bar-section advanced-section">
                    <ul class="left">
                        <li><a href="#" id="top_adv_search_icon" class="top_adv_search_icon">{{advanced}}</a></li>
                    </ul>
                </section>
            </div>
            -->

            <div class="right">
                <section class="top-bar-section">
                        <ul class="right">             
                            <li class="utility_toolbar">
                                {{#globalSearch}}
                                    {{>globalSearchContainer}}
                                {{/globalSearch}}
                                <ul id="view_elements">
                                </ul>
                                <ul id="toolbar_elements">
                                </ul>
                                <ul>
                                    <li class="utility_toolbar_element">
                                        <div class="toolbar_icon top_help slipstream-top-help" data-ua-id="{{global_help_id}}" ></div>
                                    </li>
                                </ul>
                            </li>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    </nav>
</div>

<!-- Primary nav bar-->

<div class="primary-nav-wrapper">
    <div>
        <a class="menu-control-anchor" href="#secondary-nav-region"><div class="menu-control"></div></a>
    </div>
    <div>
        <nav id="primary-nav-region"></nav>
    </div>
</div>

<!-- Left nav & main Content -->
<div id="secondary-nav-region-wrapper">
   <div id="secondary-nav-region">
    </div>
</div>

<div id="leftnav-maincontent-wrapper">
    <div class="right-pane">
        <div id="breadcrumb-region">
        </div>
        <div id="main_content">
        </div>
    </div>
</div>

<!-- Overlay content-->
<div id="overlay_content"></div>