<GameFile>
  <PropertyGroup Name="ChessWindow" Type="Layer" ID="b02b84d5-16b9-4caf-8f2d-812997736448" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Layer" ctype="GameLayerObjectData">
        <Size X="1280.0000" Y="720.0000" />
        <Children>
          <AbstractNodeData Name="Bg_Chess" ActionTag="-1474364070" Tag="2" IconVisible="False" ctype="SpriteObjectData">
            <Size X="1280.0000" Y="720.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="360.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.5000" />
            <PreSize X="1.0000" Y="1.0000" />
            <FileData Type="Normal" Path="Games/Chess/Image/Chess_Bg.png" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="Label_Rid" ActionTag="-899273283" Tag="50" IconVisible="False" LeftMargin="109.4455" RightMargin="994.5545" TopMargin="50.3836" BottomMargin="632.6164" FontSize="25" LabelText="房号:123456000" HorizontalAlignmentType="HT_Center" OutlineEnabled="True" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
            <Size X="176.0000" Y="37.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="197.4455" Y="651.1164" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="253" G="245" B="196" />
            <PrePosition X="0.1543" Y="0.9043" />
            <PreSize X="0.1375" Y="0.0514" />
            <FontResource Type="Normal" Path="Fonts/YaHei.ttf" Plist="" />
            <OutlineColor A="255" R="95" G="16" B="3" />
            <ShadowColor A="255" R="26" G="26" B="26" />
          </AbstractNodeData>
          <AbstractNodeData Name="ND_VChatBtn" ActionTag="-1548715300" VisibleForFrame="False" Tag="3" IconVisible="False" LeftMargin="1463.0000" RightMargin="-257.0000" TopMargin="536.0000" BottomMargin="108.0000" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="44" Scale9Height="54" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
            <Size X="74.0000" Y="76.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="1500.0000" Y="146.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="1.1719" Y="0.2028" />
            <PreSize X="0.0578" Y="0.1056" />
            <TextColor A="255" R="65" G="65" B="70" />
            <DisabledFileData Type="Normal" Path="Games/Chess/Image/BTN_VoiceD.png" Plist="" />
            <PressedFileData Type="Normal" Path="Games/Chess/Image/BTN_VoiceP.png" Plist="" />
            <NormalFileData Type="Normal" Path="Games/Chess/Image/BTN_VoiceN.png" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="ND_ChatBtn" ActionTag="786488780" Tag="4" IconVisible="False" LeftMargin="1193.0000" RightMargin="13.0000" TopMargin="626.0000" BottomMargin="18.0000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="44" Scale9Height="54" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
            <Size X="74.0000" Y="76.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="1230.0000" Y="56.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.9609" Y="0.0778" />
            <PreSize X="0.0578" Y="0.1056" />
            <TextColor A="255" R="65" G="65" B="70" />
            <DisabledFileData Type="Normal" Path="Games/Chess/Image/BTN_MsgN.png" Plist="" />
            <PressedFileData Type="Normal" Path="Games/Chess/Image/BTN_MsgP.png" Plist="" />
            <NormalFileData Type="Normal" Path="Games/Chess/Image/BTN_MsgN.png" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="ND_Prepare" ActionTag="-2124302576" Tag="91" IconVisible="True" LeftMargin="651.0000" RightMargin="629.0000" TopMargin="354.0000" BottomMargin="366.0000" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
            <Size X="0.0000" Y="0.0000" />
            <AnchorPoint />
            <Position X="651.0000" Y="366.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5086" Y="0.5083" />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="Games/Chess/Prepare/Prepare.csd" Plist="" />
          </AbstractNodeData>
          <AbstractNodeData Name="ND_RoomInfo" ActionTag="-900527456" Tag="99" IconVisible="False" LeftMargin="60.3487" RightMargin="939.6513" TopMargin="-0.6682" BottomMargin="666.6682" ctype="SpriteObjectData">
            <Size X="280.0000" Y="54.0000" />
            <Children>
              <AbstractNodeData Name="1" ActionTag="164135192" Tag="100" IconVisible="False" LeftMargin="104.2500" RightMargin="113.7500" TopMargin="2.6078" BottomMargin="17.3922" ctype="SpriteObjectData">
                <Size X="62.0000" Y="34.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="135.2500" Y="34.3922" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.4830" Y="0.6369" />
                <PreSize X="0.2214" Y="0.6296" />
                <FileData Type="Normal" Path="Games/Chess/Image/IMG_RoomInfo_2.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="2" ActionTag="2127206856" VisibleForFrame="False" Tag="101" IconVisible="False" LeftMargin="119.8482" RightMargin="38.1518" TopMargin="2.6078" BottomMargin="17.3922" ctype="SpriteObjectData">
                <Size X="122.0000" Y="34.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="180.8482" Y="34.3922" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.6459" Y="0.6369" />
                <PreSize X="0.4357" Y="0.6296" />
                <FileData Type="Normal" Path="Games/Chess/Image/IMG_RoomInfo_3.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="200.3487" Y="693.6682" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.1565" Y="0.9634" />
            <PreSize X="0.2188" Y="0.0750" />
            <FileData Type="Normal" Path="Games/Chess/Image/IMG_RoomInfo_1.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="ND_SetBase" ActionTag="1377399365" Tag="102" IconVisible="True" LeftMargin="158.0000" RightMargin="1122.0000" TopMargin="264.7876" BottomMargin="455.2124" ctype="SingleNodeObjectData">
            <Size X="0.0000" Y="0.0000" />
            <Children>
              <AbstractNodeData Name="Img_Bg" ActionTag="-1355415990" Tag="114" IconVisible="False" LeftMargin="-140.9998" RightMargin="-121.0002" TopMargin="-25.0000" BottomMargin="-25.0000" ctype="SpriteObjectData">
                <Size X="262.0000" Y="50.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="-9.9998" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <FileData Type="Normal" Path="Games/Chess/Image/IMG_Base_1.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="Btn_SetBase" ActionTag="2062656099" Tag="115" IconVisible="False" LeftMargin="-98.0000" RightMargin="-98.0000" TopMargin="32.0000" BottomMargin="-116.0000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="166" Scale9Height="62" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="196.0000" Y="84.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position Y="-74.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <TextColor A="255" R="65" G="65" B="70" />
                <DisabledFileData Type="Normal" Path="Games/Chess/Image/Btn_SetBase_3.png" Plist="" />
                <PressedFileData Type="Normal" Path="Games/Chess/Image/Btn_SetBase_2.png" Plist="" />
                <NormalFileData Type="Normal" Path="Games/Chess/Image/Btn_SetBase_1.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="Fnt_Base" ActionTag="-876437849" Tag="116" IconVisible="False" LeftMargin="-65.3702" RightMargin="-116.6298" TopMargin="-11.3584" BottomMargin="-20.6416" LabelText="999999.99w" ctype="TextBMFontObjectData">
                <Size X="182.0000" Y="32.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="25.6298" Y="-4.6416" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <LabelBMFontFile_CNB Type="Normal" Path="Fonts/hall_num.fnt" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="Btn_Help" ActionTag="-3989399" VisibleForFrame="False" Tag="212" IconVisible="False" LeftMargin="116.5639" RightMargin="-164.5639" TopMargin="-23.5385" BottomMargin="-24.4615" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="18" Scale9Height="26" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="48.0000" Y="48.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="140.5639" Y="-0.4615" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="0.0000" Y="0.0000" />
                <TextColor A="255" R="65" G="65" B="70" />
                <DisabledFileData Type="Normal" Path="Games/Chess/Image/Btn_Help_0.png" Plist="" />
                <PressedFileData Type="Normal" Path="Games/Chess/Image/Btn_Help_1.png" Plist="" />
                <NormalFileData Type="Normal" Path="Games/Chess/Image/Btn_Help_0.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint />
            <Position X="158.0000" Y="455.2124" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.1234" Y="0.6322" />
            <PreSize X="0.0000" Y="0.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="Btn_GiveUp" ActionTag="-1057654823" Tag="140" IconVisible="False" LeftMargin="60.0000" RightMargin="1024.0000" TopMargin="296.6687" BottomMargin="339.3313" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="166" Scale9Height="62" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
            <Size X="196.0000" Y="84.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="158.0000" Y="381.3313" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.1234" Y="0.5296" />
            <PreSize X="0.1531" Y="0.1167" />
            <TextColor A="255" R="65" G="65" B="70" />
            <DisabledFileData Type="Normal" Path="Games/Chess/Image/Btn_GiveUp_1.png" Plist="" />
            <PressedFileData Type="Normal" Path="Games/Chess/Image/Btn_GiveUp_2.png" Plist="" />
            <NormalFileData Type="Normal" Path="Games/Chess/Image/Btn_GiveUp_1.png" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="Btn_Exit" ActionTag="-1882303039" Tag="5" IconVisible="False" LeftMargin="6.2199" RightMargin="1201.7802" TopMargin="7.9423" BottomMargin="640.0577" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="42" Scale9Height="50" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
            <Size X="72.0000" Y="72.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="42.2199" Y="676.0577" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.0330" Y="0.9390" />
            <PreSize X="0.0562" Y="0.1000" />
            <TextColor A="255" R="65" G="65" B="70" />
            <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
            <PressedFileData Type="Normal" Path="Common/Images/BTN_ExitGameP.png" Plist="" />
            <NormalFileData Type="Normal" Path="Common/Images/BTN_ExitGameN.png" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="Btn_Invite" ActionTag="-1647212427" Tag="127" IconVisible="False" LeftMargin="1000.0000" RightMargin="20.0000" TopMargin="138.0000" BottomMargin="466.0000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="230" Scale9Height="94" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
            <Size X="260.0000" Y="116.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="1130.0000" Y="524.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.8828" Y="0.7278" />
            <PreSize X="0.2031" Y="0.1611" />
            <TextColor A="255" R="65" G="65" B="70" />
            <DisabledFileData Type="Normal" Path="Games/Chess/Image/Btn_Invite_1.png" Plist="" />
            <PressedFileData Type="Normal" Path="Games/Chess/Image/Btn_Invite_2.png" Plist="" />
            <NormalFileData Type="Normal" Path="Games/Chess/Image/Btn_Invite_1.png" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="Player_1" ActionTag="-1492520807" Tag="53" IconVisible="True" LeftMargin="158.0000" RightMargin="1122.0000" TopMargin="576.0000" BottomMargin="144.0000" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
            <Size X="0.0000" Y="0.0000" />
            <AnchorPoint />
            <Position X="158.0000" Y="144.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.1234" Y="0.2000" />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="Games/Chess/Player/Player.csd" Plist="" />
          </AbstractNodeData>
          <AbstractNodeData Name="Player_2" ActionTag="-1722696737" Tag="68" IconVisible="True" LeftMargin="1130.0000" RightMargin="150.0000" TopMargin="196.0000" BottomMargin="524.0000" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
            <Size X="0.0000" Y="0.0000" />
            <AnchorPoint />
            <Position X="1130.0000" Y="524.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.8828" Y="0.7278" />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="Games/Chess/Player/Player.csd" Plist="" />
          </AbstractNodeData>
          <AbstractNodeData Name="ND_RoomMenu" ActionTag="-252895282" Tag="117" IconVisible="True" LeftMargin="1192.0000" RightMargin="88.0000" TopMargin="38.0000" BottomMargin="682.0000" ctype="SingleNodeObjectData">
            <Size X="0.0000" Y="0.0000" />
            <AnchorPoint />
            <Position X="1192.0000" Y="682.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.9312" Y="0.9472" />
            <PreSize X="0.0000" Y="0.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="ND_SysInfo" ActionTag="1158780727" Tag="240" IconVisible="True" LeftMargin="1200.0000" RightMargin="80.0000" TopMargin="14.0000" BottomMargin="706.0000" ctype="SingleNodeObjectData">
            <Size X="0.0000" Y="0.0000" />
            <AnchorPoint />
            <Position X="1200.0000" Y="706.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.9375" Y="0.9806" />
            <PreSize X="0.0000" Y="0.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="ND_TableTip" ActionTag="1442707621" Tag="216" IconVisible="True" LeftMargin="650.0000" RightMargin="630.0000" TopMargin="420.0000" BottomMargin="300.0000" ctype="SingleNodeObjectData">
            <Size X="0.0000" Y="0.0000" />
            <AnchorPoint />
            <Position X="650.0000" Y="300.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5078" Y="0.4167" />
            <PreSize X="0.0000" Y="0.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="ND_TaskBox" ActionTag="419513811" Tag="105" IconVisible="True" LeftMargin="1667.1007" RightMargin="-387.1007" TopMargin="410.7531" BottomMargin="309.2469" ctype="SingleNodeObjectData">
            <Size X="0.0000" Y="0.0000" />
            <AnchorPoint />
            <Position X="1667.1007" Y="309.2469" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="1.3024" Y="0.4295" />
            <PreSize X="0.0000" Y="0.0000" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>