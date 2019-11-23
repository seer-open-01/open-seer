<GameFile>
  <PropertyGroup Name="SettlementRound" Type="Layer" ID="781d31cd-c8c3-4c32-a7d2-aaa5cc0e4371" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Layer" Tag="34903" ctype="GameLayerObjectData">
        <Size X="1280.0000" Y="720.0000" />
        <Children>
          <AbstractNodeData Name="ND_PopWin" ActionTag="-1003477391" Tag="80" IconVisible="True" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="640.0000" RightMargin="640.0000" TopMargin="360.0000" BottomMargin="360.0000" ctype="SingleNodeObjectData">
            <Size X="0.0000" Y="0.0000" />
            <Children>
              <AbstractNodeData Name="Bg_Settle" ActionTag="1618179067" Tag="939" IconVisible="False" LeftMargin="-640.0000" RightMargin="-640.0000" TopMargin="-360.0000" BottomMargin="-360.0000" ctype="SpriteObjectData">
                <Size X="1280.0000" Y="720.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <FileData Type="Normal" Path="Games/Run/Image/Settlement_1.png" Plist="" />
                <BlendFunc Src="770" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="Mask_bg" ActionTag="-1710465447" Alpha="0" Tag="375" IconVisible="False" LeftMargin="-640.0000" RightMargin="-640.0000" TopMargin="-360.0000" BottomMargin="-360.0000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="16" Scale9Height="14" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="1280.0000" Y="720.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <TextColor A="255" R="65" G="65" B="70" />
                <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
                <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
                <NormalFileData Type="Default" Path="Default/Button_Normal.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="Title_Fail" ActionTag="-398155914" Tag="5577" IconVisible="False" LeftMargin="-257.0000" RightMargin="-257.0000" TopMargin="-386.0000" BottomMargin="214.0000" ctype="SpriteObjectData">
                <Size X="514.0000" Y="172.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position Y="300.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <FileData Type="Normal" Path="Games/Run/Image/Settlement_7.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="Title_Victory" ActionTag="1592564352" Tag="5576" IconVisible="False" LeftMargin="-257.0000" RightMargin="-257.0000" TopMargin="-386.0000" BottomMargin="214.0000" ctype="SpriteObjectData">
                <Size X="514.0000" Y="172.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position Y="300.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <FileData Type="Normal" Path="Games/Run/Image/Settlement_6.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="TXT_RoundInfo" ActionTag="2119300162" VisibleForFrame="False" Tag="208" IconVisible="False" LeftMargin="-538.5000" RightMargin="341.5000" TopMargin="256.5000" BottomMargin="-355.5000" FontSize="24" LabelText="2018/888/88:88:88&#xA;牌局号: 123456789&#xA;房间: 888888888" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="197.0000" Y="99.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="-440.0000" Y="-306.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="222" G="105" B="42" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <FontResource Type="Normal" Path="Fonts/YaHei.ttf" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="ND_Players" ActionTag="706665571" Tag="39383" IconVisible="True" LeftMargin="-500.0000" RightMargin="500.0000" TopMargin="212.0000" BottomMargin="-212.0000" ctype="SingleNodeObjectData">
                <Size X="0.0000" Y="0.0000" />
                <Children>
                  <AbstractNodeData Name="Player_1" ActionTag="-63846365" Tag="39591" IconVisible="True" LeftMargin="-120.0000" RightMargin="-1120.0000" TopMargin="-436.0000" BottomMargin="334.0000" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                    <Size X="1240.0000" Y="102.0000" />
                    <AnchorPoint />
                    <Position X="-120.0000" Y="334.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="0.0000" Y="0.0000" />
                    <FileData Type="Normal" Path="Games/Run/Settlement/SettlementRoundPlayerInfo.csd" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="Player_2" ActionTag="66507703" Tag="40938" IconVisible="True" LeftMargin="-120.0000" RightMargin="-1120.0000" TopMargin="-324.0000" BottomMargin="222.0000" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                    <Size X="1240.0000" Y="102.0000" />
                    <AnchorPoint />
                    <Position X="-120.0000" Y="222.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="0.0000" Y="0.0000" />
                    <FileData Type="Normal" Path="Games/Run/Settlement/SettlementRoundPlayerInfo.csd" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="Player_3" ActionTag="1336204278" Tag="41040" IconVisible="True" LeftMargin="-120.0000" RightMargin="-1120.0000" TopMargin="-212.0000" BottomMargin="110.0000" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                    <Size X="1240.0000" Y="102.0000" />
                    <AnchorPoint />
                    <Position X="-120.0000" Y="110.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="0.0000" Y="0.0000" />
                    <FileData Type="Normal" Path="Games/Run/Settlement/SettlementRoundPlayerInfo.csd" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="Player_4" ActionTag="1924367602" VisibleForFrame="False" Tag="1089" IconVisible="True" LeftMargin="-120.0000" RightMargin="-1120.0000" TopMargin="-102.0000" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                    <Size X="1240.0000" Y="102.0000" />
                    <AnchorPoint />
                    <Position X="-120.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="0.0000" Y="0.0000" />
                    <FileData Type="Normal" Path="Games/Run/Settlement/SettlementRoundPlayerInfo.csd" Plist="" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint />
                <Position X="-500.0000" Y="-212.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="BTN_Share" ActionTag="-1763681125" Tag="39375" IconVisible="False" LeftMargin="-122.0000" RightMargin="-122.0000" TopMargin="254.9395" BottomMargin="-358.9395" TouchEnable="True" FontSize="36" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="214" Scale9Height="82" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="244.0000" Y="104.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position Y="-306.9395" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <TextColor A="255" R="65" G="65" B="70" />
                <DisabledFileData Type="Normal" Path="Games/Run/Image/Settlement_BTNShareN.png" Plist="" />
                <PressedFileData Type="Normal" Path="Games/Run/Image/Settlement_BTNShareP.png" Plist="" />
                <NormalFileData Type="Normal" Path="Games/Run/Image/Settlement_BTNShareN.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="BTN_Next" ActionTag="-1228901542" Tag="39376" IconVisible="False" LeftMargin="238.0000" RightMargin="-482.0000" TopMargin="254.9395" BottomMargin="-358.9395" TouchEnable="True" FontSize="36" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="214" Scale9Height="82" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="244.0000" Y="104.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="360.0000" Y="-306.9395" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <TextColor A="255" R="65" G="65" B="70" />
                <DisabledFileData Type="Normal" Path="Games/Run/Image/Btn_Next_1.png" Plist="" />
                <PressedFileData Type="Normal" Path="Games/Run/Image/Btn_Next_2.png" Plist="" />
                <NormalFileData Type="Normal" Path="Games/Run/Image/Btn_Next_1.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="BTN_Leave" ActionTag="-975140870" Tag="90" IconVisible="False" LeftMargin="-483.3300" RightMargin="239.3300" TopMargin="254.9396" BottomMargin="-358.9396" TouchEnable="True" FontSize="36" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="214" Scale9Height="82" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="244.0000" Y="104.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="-361.3300" Y="-306.9396" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <TextColor A="255" R="65" G="65" B="70" />
                <DisabledFileData Type="Normal" Path="Games/Run/Image/Btn_Leave_1.png" Plist="" />
                <PressedFileData Type="Normal" Path="Games/Run/Image/Btn_Leave_2.png" Plist="" />
                <NormalFileData Type="Normal" Path="Games/Run/Image/Btn_Leave_1.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="Label_Time" ActionTag="1619032550" Tag="941" IconVisible="False" LeftMargin="-332.6738" RightMargin="274.6738" TopMargin="278.0636" BottomMargin="-330.0636" FontSize="33" LabelText="(10)" HorizontalAlignmentType="HT_Center" VerticalAlignmentType="VT_Center" OutlineSize="3" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="58.0000" Y="52.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="-303.6738" Y="-304.0636" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="214" G="248" B="253" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <FontResource Type="Normal" Path="Fonts/YaHei.ttf" Plist="" />
                <OutlineColor A="255" R="34" G="116" B="146" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="Qr_Code_1" ActionTag="2038962839" VisibleForFrame="False" Tag="146" IconVisible="False" LeftMargin="416.9957" RightMargin="-462.9957" TopMargin="-324.0001" BottomMargin="278.0001" ctype="SpriteObjectData">
                <Size X="46.0000" Y="46.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="439.9957" Y="301.0001" />
                <Scale ScaleX="0.6300" ScaleY="0.6300" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <FileData Type="Default" Path="Default/Sprite.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
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