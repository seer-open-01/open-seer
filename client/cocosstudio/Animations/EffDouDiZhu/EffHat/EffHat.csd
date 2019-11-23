<GameFile>
  <PropertyGroup Name="EffHat" Type="Node" ID="292e461e-f2de-4531-887f-cfe3c25018bb" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="90" Speed="1.0000" ActivedAnimationName="animation0">
        <Timeline ActionTag="778728643" Property="Scale">
          <ScaleFrame FrameIndex="0" X="3.0000" Y="3.0000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="15" X="1.8000" Y="1.8000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="25" X="1.2000" Y="1.2000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="35" X="1.0000" Y="1.0000">
            <EasingData Type="0" />
          </ScaleFrame>
        </Timeline>
        <Timeline ActionTag="778728643" Property="Alpha">
          <IntFrame FrameIndex="0" Value="0">
            <EasingData Type="0" />
          </IntFrame>
          <IntFrame FrameIndex="5" Value="20">
            <EasingData Type="0" />
          </IntFrame>
          <IntFrame FrameIndex="15" Value="255">
            <EasingData Type="0" />
          </IntFrame>
        </Timeline>
        <Timeline ActionTag="895321098" Property="Alpha">
          <IntFrame FrameIndex="30" Value="0">
            <EasingData Type="0" />
          </IntFrame>
          <IntFrame FrameIndex="32" Value="255">
            <EasingData Type="0" />
          </IntFrame>
          <IntFrame FrameIndex="40" Value="255">
            <EasingData Type="0" />
          </IntFrame>
          <IntFrame FrameIndex="50" Value="0">
            <EasingData Type="0" />
          </IntFrame>
        </Timeline>
        <Timeline ActionTag="895321098" Property="BlendFunc">
          <BlendFuncFrame FrameIndex="0" Tween="False" Src="1" Dst="1" />
        </Timeline>
        <Timeline ActionTag="-356174939" Property="Alpha">
          <IntFrame FrameIndex="42" Value="0">
            <EasingData Type="0" />
          </IntFrame>
          <IntFrame FrameIndex="45" Value="255">
            <EasingData Type="0" />
          </IntFrame>
          <IntFrame FrameIndex="52" Value="255">
            <EasingData Type="0" />
          </IntFrame>
          <IntFrame FrameIndex="60" Value="0">
            <EasingData Type="0" />
          </IntFrame>
        </Timeline>
        <Timeline ActionTag="-356174939" Property="BlendFunc">
          <BlendFuncFrame FrameIndex="0" Tween="False" Src="1" Dst="1" />
        </Timeline>
        <Timeline ActionTag="1489456078" Property="Alpha">
          <IntFrame FrameIndex="71" Value="0">
            <EasingData Type="0" />
          </IntFrame>
          <IntFrame FrameIndex="74" Value="255">
            <EasingData Type="0" />
          </IntFrame>
          <IntFrame FrameIndex="79" Value="255">
            <EasingData Type="0" />
          </IntFrame>
          <IntFrame FrameIndex="90" Value="0">
            <EasingData Type="0" />
          </IntFrame>
        </Timeline>
        <Timeline ActionTag="1489456078" Property="BlendFunc">
          <BlendFuncFrame FrameIndex="0" Tween="False" Src="1" Dst="1" />
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="animation0" StartIndex="0" EndIndex="90">
          <RenderColor A="255" R="248" G="248" B="255" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="61" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="DDZBiaoShi_1" ActionTag="778728643" Alpha="114" Tag="62" IconVisible="False" LeftMargin="-28.0000" RightMargin="-28.0000" TopMargin="-28.0000" BottomMargin="-28.0000" ctype="SpriteObjectData">
            <Size X="56.0000" Y="56.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="2.2800" ScaleY="2.2800" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="Animations/EffDouDiZhu/EffHat/DDZBiaoShi.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="DDZStar_2" ActionTag="895321098" Alpha="0" Tag="63" IconVisible="False" LeftMargin="-43.9828" RightMargin="2.9828" TopMargin="-24.3254" BottomMargin="-16.6746" ctype="SpriteObjectData">
            <Size X="41.0000" Y="41.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="-23.4828" Y="3.8254" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="235" B="177" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="Animations/EffDouDiZhu/EffHat/DDZStar.png" Plist="" />
            <BlendFunc Src="1" Dst="1" />
          </AbstractNodeData>
          <AbstractNodeData Name="DDZStar_3" ActionTag="-356174939" Alpha="0" Tag="64" IconVisible="False" LeftMargin="2.8149" RightMargin="-43.8149" TopMargin="-0.7049" BottomMargin="-40.2951" ctype="SpriteObjectData">
            <Size X="41.0000" Y="41.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="23.3149" Y="-19.7951" />
            <Scale ScaleX="0.7500" ScaleY="0.7500" />
            <CColor A="255" R="255" G="216" B="171" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="Animations/EffDouDiZhu/EffHat/DDZStar.png" Plist="" />
            <BlendFunc Src="1" Dst="1" />
          </AbstractNodeData>
          <AbstractNodeData Name="DDZStar_4" ActionTag="1489456078" Alpha="0" Tag="65" IconVisible="False" LeftMargin="-4.6519" RightMargin="-36.3481" TopMargin="-49.4871" BottomMargin="8.4871" ctype="SpriteObjectData">
            <Size X="41.0000" Y="41.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="15.8481" Y="28.9871" />
            <Scale ScaleX="0.4000" ScaleY="0.4000" />
            <CColor A="255" R="255" G="203" B="145" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="Animations/EffDouDiZhu/EffHat/DDZStar.png" Plist="" />
            <BlendFunc Src="1" Dst="1" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>