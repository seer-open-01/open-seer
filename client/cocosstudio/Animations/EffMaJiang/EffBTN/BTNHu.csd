<GameFile>
  <PropertyGroup Name="BTNHu" Type="Node" ID="2129532f-ed8a-452f-a265-8ce2c9210220" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="60" Speed="1.0000" ActivedAnimationName="animation0">
        <Timeline ActionTag="1994701689" Property="Scale">
          <ScaleFrame FrameIndex="0" X="0.2500" Y="0.2500">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="10" X="0.2917" Y="0.2917">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="60" X="0.4000" Y="0.4000">
            <EasingData Type="0" />
          </ScaleFrame>
        </Timeline>
        <Timeline ActionTag="1994701689" Property="Alpha">
          <IntFrame FrameIndex="10" Value="255">
            <EasingData Type="0" />
          </IntFrame>
          <IntFrame FrameIndex="35" Value="153">
            <EasingData Type="0" />
          </IntFrame>
          <IntFrame FrameIndex="60" Value="0">
            <EasingData Type="0" />
          </IntFrame>
        </Timeline>
        <Timeline ActionTag="1994701689" Property="CColor">
          <ColorFrame FrameIndex="10" Alpha="255">
            <EasingData Type="0" />
            <Color A="255" R="255" G="255" B="255" />
          </ColorFrame>
          <ColorFrame FrameIndex="35" Alpha="255">
            <EasingData Type="0" />
            <Color A="255" R="255" G="135" B="92" />
          </ColorFrame>
          <ColorFrame FrameIndex="60" Alpha="255">
            <EasingData Type="0" />
            <Color A="255" R="255" G="54" B="0" />
          </ColorFrame>
        </Timeline>
        <Timeline ActionTag="-1750374125" Property="RotationSkew">
          <ScaleFrame FrameIndex="0" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="60" X="-180.0000" Y="-180.0000">
            <EasingData Type="0" />
          </ScaleFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="animation0" StartIndex="0" EndIndex="60">
          <RenderColor A="255" R="173" G="216" B="230" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="116" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="BTNHuan_3" ActionTag="1994701689" Tag="119" IconVisible="False" LeftMargin="-256.0000" RightMargin="-256.0000" TopMargin="-258.0000" BottomMargin="-254.0000" ctype="SpriteObjectData">
            <Size X="512.0000" Y="512.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position Y="2.0000" />
            <Scale ScaleX="0.2500" ScaleY="0.2500" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="Animations/EffMaJiang/EffBTN/BTNHuan.png" Plist="" />
            <BlendFunc Src="770" Dst="1" />
          </AbstractNodeData>
          <AbstractNodeData Name="BTNQuan_2" ActionTag="-1750374125" Alpha="204" Tag="118" IconVisible="False" LeftMargin="-128.0000" RightMargin="-128.0000" TopMargin="-130.0000" BottomMargin="-126.0000" ctype="SpriteObjectData">
            <Size X="256.0000" Y="256.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position Y="2.0000" />
            <Scale ScaleX="0.5600" ScaleY="0.5600" />
            <CColor A="255" R="255" G="229" B="183" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="Animations/EffMaJiang/EffBTN/BTNQuan.png" Plist="" />
            <BlendFunc Src="1" Dst="1" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>