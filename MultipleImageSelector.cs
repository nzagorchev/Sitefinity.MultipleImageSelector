using System;
using System.Collections.Generic;
using System.Web.Script.Serialization;
using System.Web.UI.WebControls;
using Telerik.Sitefinity.Web.UI;

namespace SitefinityWebApp.ImageSelector.MultipleImageSelector
{
    [Telerik.Sitefinity.Web.UI.ControlDesign.ControlDesigner(typeof(MultipleImageSelectorDesigner))]
    public class MultipleImageSelector : SimpleView
    {
        #region Properties
        /// <summary>
        /// Gets or sets the message that will be displayed in the label.
        /// </summary>
        public string Message { get; set; }
        public string SelectedImagesIds { get; set; }       

        /// <summary>
        /// Gets the layout template's relative or virtual path.
        /// </summary>
        public override string LayoutTemplatePath
        {
            get
            {
                if (string.IsNullOrEmpty(base.LayoutTemplatePath))
                    return MultipleImageSelector.layoutTemplatePath;
                return base.LayoutTemplatePath;
            }
            set
            {
                base.LayoutTemplatePath = value;
            }
        }
        #endregion

        #region Control References
        /// <summary>
        /// Reference to the Label control that shows the Message.
        /// </summary>
        protected virtual Label MessageLabel
        {
            get
            {
                return this.Container.GetControl<Label>("MessageLabel", true);
            }
        }
        #endregion

        #region Methods
        /// <summary>
        /// Initializes the controls.
        /// </summary>
        /// <param name="container"></param>
        /// <remarks>
        /// Initialize your controls in this method. Do not override CreateChildControls method.
        /// </remarks>
        protected override void InitializeControls(GenericContainer container)
        {
            Label messageLabel = this.MessageLabel;
            if (string.IsNullOrEmpty(this.Message))
            {
                messageLabel.Text = "Hello, World!";
            }
            else
            {
                messageLabel.Text = this.Message;
            }

            List<Guid> list = new JavaScriptSerializer().Deserialize<List<Guid>>(this.SelectedImagesIds);
        }

        #endregion

        #region Private members & constants
        public static readonly string layoutTemplatePath = "~/ImageSelector/MultipleImageSelector/MultipleImageSelector.ascx";
        #endregion
    }
}
