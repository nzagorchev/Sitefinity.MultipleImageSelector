<%@ Control %>
<%@ Register Assembly="Telerik.Sitefinity" TagPrefix="sf" Namespace="Telerik.Sitefinity.Web.UI" %>
<%@ Register Assembly="Telerik.Sitefinity" TagPrefix="sitefinity" Namespace="Telerik.Sitefinity.Web.UI" %>
<%@ Register Assembly="Telerik.Sitefinity" TagPrefix="sfFields" Namespace="Telerik.Sitefinity.Web.UI.Fields" %>
<%@ Register Assembly="Telerik.Sitefinity" Namespace="Telerik.Sitefinity.Modules.Libraries.Web.UI.Designers" TagPrefix="sf" %>

<%@ Register Assembly="SitefinityWebApp" Namespace="SitefinityWebApp.LibrarySelector" TagPrefix="sf" %>

<sitefinity:ResourceLinks ID="resourcesLinks" runat="server">
    <sitefinity:ResourceFile Name="Styles/Ajax.css" />
    <sitefinity:ResourceFile Name="Styles/jQuery/jquery.ui.core.css" />
    <sitefinity:ResourceFile Name="Styles/jQuery/jquery.ui.dialog.css" />
    <sitefinity:ResourceFile Name="Styles/jQuery/jquery.ui.theme.sitefinity.css" />
</sitefinity:ResourceLinks>

<style>
    img.tmb {
        width: 80px;
        height: auto;
    }

    #ImagesSelector {
        overflow: hidden;
    }

    .left {
        /*width: 300px;*/
        float: left; 
    }

    .right {
        overflow: hidden;
        padding-left: 2%;
        padding-top: 1.5%;
    }

    .sfButtonArea {
        clear: both;
    }
</style>

<div id="designerLayoutRoot" class="sfContentViews sfSingleContentView" style="max-height: 400px; overflow: auto;">
    <ol>
        <li class="sfFormCtrl">
            <asp:Label runat="server" AssociatedControlID="Message" CssClass="sfTxtLbl">Message</asp:Label>
            <asp:TextBox ID="Message" runat="server" CssClass="sfTxt" />
            <div class="sfExample"></div>
        </li>

        <li class="sfFormCtrl">
            <label class="sfTxtLbl" for="selectedTestLabel">ImagesSelector</label>
            <div id="ImagesSelector">
                <div class="left">
                    <sf:FlatSelector ID="ItemSelector" runat="server" ItemType="Telerik.Sitefinity.Libraries.Model.Image"
                        DataKeyNames="Id" ShowSelectedFilter="true" AllowPaging="true" PageSize="3" AllowMultipleSelection="true"
                        AllowSearching="true" ShowProvidersList="false" InclueAllProvidersOption="false" EnablePersistedSelection="true"
                        SearchBoxTitleText="Filter by Title" ShowHeader="true" ServiceUrl="/Sitefinity/Services/Content/ImageService.svc/">
                        <DataMembers>
                            <sf:DataMemberInfo runat="server" Name="Title" IsExtendedSearchField="true" HeaderText='Title'>
                                <div><img alt="Alternate Text" class="tmb" /><span>{{ThumbnailUrl}}</span></div>
                <strong>{{Title}}</strong>
                            </sf:DataMemberInfo>

                            <sf:DataMemberInfo runat="server" Name="PublicationDate" HeaderText='Date'>
                <span>{{PublicationDate ? PublicationDate.sitefinityLocaleFormat('dd MMM, yyyy') : ""}}</span>
                            </sf:DataMemberInfo>
                        </DataMembers>
                    </sf:FlatSelector>
                </div>
                <div class="right">                   
                    <sf:MyLibrarySelector ID="est" runat="server" DisplayMode="Write"></sf:MyLibrarySelector>
                </div>
                <asp:Panel runat="server" ID="buttonAreaPanel" class="sfButtonArea sfSelectorBtns">
                    <asp:LinkButton ID="lnkDone" runat="server" OnClientClick="return false;" CssClass="sfLinkBtn sfSave">
                <strong class="sfLinkBtnIn">
                    <asp:Literal runat="server" Text="<%$Resources:Labels, Done %>" />
                </strong>
                    </asp:LinkButton>
                    <asp:Literal runat="server" Text="<%$Resources:Labels, or%>" />
                    <asp:LinkButton ID="lnkCancel" runat="server" CssClass="sfCancel" OnClientClick="return false;">
                <asp:Literal runat="server" Text="<%$Resources:Labels, Cancel %>" />
                    </asp:LinkButton>
                </asp:Panel>
            </div>
            <ul id="selectedItemsList" runat="server" data-template="ul-template-ImagesSelector" data-bind="source: items" class="sfCategoriesList"></ul>
            <script id="ul-template-ImagesSelector" type="text/x-kendo-template">
    <li>
    <div data-id="#: Id#"><img src="#: ThumbnailUrl#" alt="#: Title#" class="tmb" /></div>
        <span data-bind="text: Title, attr: {data-id: Id}"> </span>
 
        <a class="remove sfRemoveBtn">Remove</a>
    </li>
            </script>
            <asp:HyperLink ID="selectButton" runat="server" NavigateUrl="javascript:void(0);" CssClass="sfLinkBtn sfChange">
    <strong class="sfLinkBtnIn">Add items...</strong>
            </asp:HyperLink>
        </li>

    </ol>
</div>
