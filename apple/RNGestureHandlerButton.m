//
//  RNGestureHandlerButton.m
//  RNGestureHandler
//
//  Created by Krzysztof Magiera on 12/10/2017.
//  Copyright © 2017 Software Mansion. All rights reserved.
//

#import "RNGestureHandlerButton.h"
#import <React/RCTScrollView.h>

#if !TARGET_OS_OSX
#import <UIKit/UIKit.h>
#endif

/**
 * Gesture Handler Button components overrides standard mechanism used by RN
 * to determine touch target, which normally would reurn the UIView that is placed
 * as the deepest element in the view hierarchy.
 * It's done this way as it allows for the actual target determination to run in JS
 * where we can travers up the view ierarchy to find first element that want to became
 * JS responder.
 *
 * Since we want to use native button (or actually a `UIControl`) we need to determine
 * the target in native. This makes it impossible for JS responder based components to
 * function as a subviews of the button component. Here we override `hitTest:withEvent:`
 * method and we only determine the target to be either a subclass of `UIControl` or a
 * view that has gesture recognizers registered.
 *
 * This "default" behaviour of target determinator should be sufficient in most of the
 * cases as in fact it is not that common UI pattern to have many nested buttons (usually
 * there are just two levels e.g. when you have clickable table cells with additional
 * buttons). In cases when the default behaviour is insufficient it is recommended to use
 * `TapGestureHandler` instead of a button which gives much better flexibility as far as
 * controlling the touch flow.
 */
@implementation RNGestureHandlerButton

- (instancetype)init
{
  self = [super init];
  if (self) {
    _hitTestEdgeInsets = UIEdgeInsetsZero;
    _userEnabled = YES;
#if !TARGET_OS_TV && !TARGET_OS_OSX
    [self setExclusiveTouch:YES];
#endif
  }
  return self;
}

- (BOOL)shouldHandleTouch:(RNGHUIView *)view
{
  // if button && enabled, always calls onPress
  // otherwise, may send something but never onPress
  if ([view isKindOfClass:[RNGestureHandlerButton class]]) {
    RNGestureHandlerButton *button = (RNGestureHandlerButton *)view;
    bool shouldHandle = button.userEnabled;
    NSLog(@"Should handle A? %d", shouldHandle);
    return shouldHandle;
  }

#if !TARGET_OS_OSX
  bool shouldHandle = [view isKindOfClass:[UIControl class]] || [view.gestureRecognizers count] > 0;
  NSLog(@"Should handle B? %d", shouldHandle);
  return shouldHandle;
#else
  return [view isKindOfClass:[NSControl class]] || [view.gestureRecognizers count] > 0;
#endif
}

#if !TARGET_OS_OSX
- (BOOL)pointInside:(CGPoint)point withEvent:(UIEvent *)event
{
  if (UIEdgeInsetsEqualToEdgeInsets(self.hitTestEdgeInsets, UIEdgeInsetsZero)) {
    return [super pointInside:point withEvent:event];
  }
  CGRect hitFrame = UIEdgeInsetsInsetRect(self.bounds, self.hitTestEdgeInsets);
  bool isInside = CGRectContainsPoint(hitFrame, point);
  // correct output
  return isInside;
}

- (RNGHUIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  NSArray *inners = self.subviews;
  RNGHUIView *innermost = (RNGHUIView *)self;
  RNGHUIView *clickableInnermost = (RNGHUIView *)self;

  for (RNGHUIView *inner in inners) {
    if ([inner pointInside:point withEvent:event]) {
      innermost = [inner hitTest:point withEvent:event];
      break;
    }
  }

  return clickableInnermost;
}
#endif

@end
