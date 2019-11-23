<GameFile>
  <PropertyGroup Name="TaskWindow" Type="Layer" ID="e48551a6-de33-4877-b2f8-ba81b1060acd" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Layer" ctype="GameLayerObjectData">
        <Size X="1280.0000" Y="720.0000" />
        <Children>
          <AbstractNodeData Name="ND_PopWin" ActionTag="1230911933" Tag="410" IconVisible="True" LeftMargin="640.0000" RightMargin="640.0000" TopMargin="360.0000" BottomMargin="360.0000" ctype="SingleNodeObjectData">
            <Size X="0.0000" Y="0.0000" />
            <Children>
              <AbstractNodeData Name="Bg_Mail" ActionTag="-71232811" Tag="10" IconVisible="False" LeftMargin="-511.4123" RightMargin="-488.5877" TopMargin="-326.6904" BottomMargin="-325.3096" ctype="SpriteObjectData">
                <Size X="1000.0000" Y="652.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="-11.4123" Y="0.6904" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <FileData Type="Normal" Path="Common/Images/PopupWing1000x652.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="Title_Mail" ActionTag="-826277700" Tag="11" IconVisible="False" LeftMargin="-115.4126" RightMargin="-92.5874" TopMargin="-284.6901" BottomMargin="236.6901" ctype="SpriteObjectData">
                <Size X="208.0000" Y="48.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="-11.4126" Y="260.6901" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <FileData Type="Normal" Path="Common/Task/Images/Title_Task.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="Text_Tip" ActionTag="-840016861" Tag="14" IconVisible="False" LeftMargin="-330.3537" RightMargin="-351.6463" TopMargin="-200.3106" BottomMargin="169.3106" FontSize="22" LabelText="温馨提示：日常任务每天24:00清零重置，请一定记得提前领取奖励哦！" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="682.0000" Y="31.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="10.6463" Y="184.8106" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="232" G="122" B="46" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <FontResource Type="Normal" Path="Fonts/YaHei.ttf" Plist="" />
                <OutlineColor A="255" R="83" G="64" B="128" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="Btn_Close" ActionTag="-1460003262" Tag="13" IconVisible="False" LeftMargin="446.5120" RightMargin="-512.5120" TopMargin="-326.2073" BottomMargin="252.2073" TouchEnable="True" FontSize="14" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="36" Scale9Height="52" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="66.0000" Y="74.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="479.5120" Y="289.2073" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <TextColor A="255" R="65" G="65" B="70" />
                <DisabledFileData Type="Normal" Path="Common/Images/BTN_CloseN.png" Plist="" />
                <PressedFileData Type="Normal" Path="Common/Images/BTN_CloseP.png" Plist="" />
                <NormalFileData Type="Normal" Path="Common/Images/BTN_CloseN.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="SV_List" ActionTag="-414328096" Tag="12" IconVisible="False" LeftMargin="-483.4091" RightMargin="-460.5909" TopMargin="-159.6920" BottomMargin="-280.3080" TouchEnable="True" ClipAble="True" BackColorAlpha="0" ComboBoxIndex="1" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" IsBounceEnabled="True" ScrollDirectionType="Vertical" ctype="ScrollViewObjectData">
                <Size X="944.0000" Y="440.0000" />
                <AnchorPoint />
                <Position X="-483.4091" Y="-280.3080" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <SingleColor A="255" R="255" G="150" B="100" />
                <FirstColor A="255" R="255" G="150" B="100" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
                <InnerNodeSize Width="944" Height="440" />
              </AbstractNodeData>
              <AbstractNodeData Name="Text_NoTask" ActionTag="595595097" Tag="54" IconVisible="False" LeftMargin="-199.9113" RightMargin="-205.0887" TopMargin="-27.1898" BottomMargin="-25.8102" IsCustomSize="True" FontSize="38" LabelText="您目前还没有任务呢……" HorizontalAlignmentType="HT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="405.0000" Y="53.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="2.5887" Y="0.6898" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="232" G="122" B="46" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <FontResource Type="Normal" Path="Fonts/YaHei.ttf" Plist="" />
                <OutlineColor A="255" R="255" G="255" B="255" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="ND_Loading" ActionTag="-1262594645" Tag="92" IconVisible="False" LeftMargin="-490.4803" RightMargin="-469.5197" TopMargin="-207.7124" BottomMargin="-302.2876" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="34" Scale9Height="42" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="960.0000" Y="510.0000" />
                <Children>
                  <AbstractNodeData Name="Loading_1" ActionTag="-1414490451" Tag="93" IconVisible="False" LeftMargin="405.0000" RightMargin="405.0000" TopMargin="180.0000" BottomMargin="180.0000" ctype="SpriteObjectData">
                    <Size X="150.0000" Y="150.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="480.0000" Y="255.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="0.1563" Y="0.2941" />
                    <FileData Type="Normal" Path="Common/Task/Images/Loading_1.png" Plist="" />
                    <BlendFunc Src="1" Dst="771" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="Loading_2" ActionTag="-1505788882" Tag="94" IconVisible="False" LeftMargin="423.0000" RightMargin="423.0000" TopMargin="198.0000" BottomMargin="198.0000" ctype="SpriteObjectData">
                    <Size X="114.0000" Y="114.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="480.0000" Y="255.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="0.1187" Y="0.2235" />
                    <FileData Type="Normal" Path="Common/Task/Images/Loading_2.png" Plist="" />
                    <BlendFunc Src="1" Dst="771" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="-10.4803" Y="-47.2876" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <TextColor A="255" R="65" G="65" B="70" />
                <DisabledFileData Type="Normal" Path="Common/Images/Com_Mask.png" Plist="" />
                <PressedFileData Type="Normal" Path="Common/Images/Com_Mask.png" Plist="" />
                <NormalFileData Type="Normal" Path="Common/Images/Com_Mask.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint />
            <Position X="640.0000" Y="360.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.5000" />
            <PreSize X="0.0000" Y="0.0000" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>