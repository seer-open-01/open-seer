<GameFile>
  <PropertyGroup Name="EffDeng" Type="Node" ID="03f4c797-e5e8-4b29-8c1d-60b4e1778e4c" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="90" Speed="1.0000" ActivedAnimationName="animation0">
        <Timeline ActionTag="827227198" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="Normal" Path="Animations/EffHall/ZhuanPan/Deng01.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="45" Tween="False">
            <TextureFile Type="Normal" Path="Animations/EffHall/ZhuanPan/Deng02.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="90" Tween="False">
            <TextureFile Type="Normal" Path="Animations/EffHall/ZhuanPan/Deng01.png" Plist="" />
          </TextureFrame>
        </Timeline>
        <Timeline ActionTag="827227198" Property="BlendFunc">
          <BlendFuncFrame FrameIndex="0" Tween="False" Src="770" Dst="1" />
          <BlendFuncFrame FrameIndex="45" Tween="False" Src="770" Dst="1" />
          <BlendFuncFrame FrameIndex="90" Tween="False" Src="770" Dst="1" />
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="animation0" StartIndex="0" EndIndex="90">
          <RenderColor A="255" R="248" G="248" B="255" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="20" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="Sprite_1" ActionTag="827227198" Tag="21" IconVisible="False" LeftMargin="-23.0000" RightMargin="-23.0000" TopMargin="-23.0000" BottomMargin="-23.0000" ctype="SpriteObjectData">
            <Size X="524.0000" Y="526.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="Animations/EffHall/ZhuanPan/Deng01.png" Plist="" />
            <BlendFunc Src="770" Dst="1" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>