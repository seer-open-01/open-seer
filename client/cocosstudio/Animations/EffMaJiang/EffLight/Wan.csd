<GameFile>
  <PropertyGroup Name="YellowGlow" Type="Node" ID="dbd4313e-30eb-43c6-806a-b02e12d20772" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="60" Speed="0.5000" ActivedAnimationName="animation0">
        <Timeline ActionTag="-1115179322" Property="Alpha">
          <IntFrame FrameIndex="0" Value="0">
            <EasingData Type="0" />
          </IntFrame>
          <IntFrame FrameIndex="10" Value="127">
            <EasingData Type="0" />
          </IntFrame>
          <IntFrame FrameIndex="30" Value="255">
            <EasingData Type="0" />
          </IntFrame>
          <IntFrame FrameIndex="50" Value="127">
            <EasingData Type="0" />
          </IntFrame>
          <IntFrame FrameIndex="60" Value="0">
            <EasingData Type="0" />
          </IntFrame>
        </Timeline>
        <Timeline ActionTag="81926982" Property="RotationSkew">
          <ScaleFrame FrameIndex="0" X="0.0100" Y="0.0100">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="60" X="359.9900" Y="359.9900">
            <EasingData Type="0" />
          </ScaleFrame>
        </Timeline>
        <Timeline ActionTag="81926982" Property="BlendFunc">
          <BlendFuncFrame FrameIndex="0" Tween="False" Src="770" Dst="1" />
          <BlendFuncFrame FrameIndex="60" Tween="False" Src="770" Dst="1" />
        </Timeline>
        <Timeline ActionTag="-556427705" Property="Scale">
          <ScaleFrame FrameIndex="0" X="1.1000" Y="1.1000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="10" X="1.2000" Y="1.2000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="45" X="1.6000" Y="1.6000">
            <EasingData Type="0" />
          </ScaleFrame>
        </Timeline>
        <Timeline ActionTag="-556427705" Property="Alpha">
          <IntFrame FrameIndex="0" Value="0">
            <EasingData Type="0" />
          </IntFrame>
          <IntFrame FrameIndex="10" Value="255">
            <EasingData Type="0" />
          </IntFrame>
          <IntFrame FrameIndex="45" Value="0">
            <EasingData Type="0" />
          </IntFrame>
        </Timeline>
        <Timeline ActionTag="-556427705" Property="BlendFunc">
          <BlendFuncFrame FrameIndex="0" Tween="False" Src="770" Dst="1" />
          <BlendFuncFrame FrameIndex="45" Tween="False" Src="770" Dst="1" />
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="animation0" StartIndex="0" EndIndex="60">
          <RenderColor A="255" R="105" G="105" B="105" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="YellowGlow" Tag="71" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="Sprite_2" ActionTag="-1115179322" Alpha="0" Tag="73" IconVisible="False" LeftMargin="-23.0000" RightMargin="-23.0000" TopMargin="-23.0000" BottomMargin="-23.0000" ctype="SpriteObjectData">
            <Size X="128.0000" Y="128.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.8000" ScaleY="1.8000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="Animations/EffMaJiang/EffLight/Yellow.png" Plist="" />
            <BlendFunc Src="1" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="Ring0905_2" ActionTag="81926982" Tag="77" RotationSkewX="0.0100" RotationSkewY="0.0100" IconVisible="False" LeftMargin="-23.0000" RightMargin="-23.0000" TopMargin="-23.0000" BottomMargin="-23.0000" ctype="SpriteObjectData">
            <Size X="256.0000" Y="256.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="0.5500" ScaleY="0.5500" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="Animations/EffMaJiang/EffLight/Ring0905.png" Plist="" />
            <BlendFunc Src="770" Dst="1" />
          </AbstractNodeData>
          <AbstractNodeData Name="Round0905_3" ActionTag="-556427705" Alpha="0" Tag="78" IconVisible="False" LeftMargin="-23.0000" RightMargin="-23.0000" TopMargin="-23.0000" BottomMargin="-23.0000" ctype="SpriteObjectData">
            <Size X="128.0000" Y="128.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.1000" ScaleY="1.1000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="Animations/EffMaJiang/EffLight/Round0905.png" Plist="" />
            <BlendFunc Src="770" Dst="1" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>