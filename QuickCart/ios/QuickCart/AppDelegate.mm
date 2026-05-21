#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import <RNBranch/RNBranch.h>
#import "DeepLinkManager.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"QuickCart";
  self.initialProps = @{};

  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

#pragma mark - Universal Links & Custom Scheme (cold-start safe via DeepLinkManager)

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options
{
  [RNBranch application:application openURL:url options:options];
  [[DeepLinkManager shared] storeIncomingURL:url.absoluteString];
  return YES;
}

- (BOOL)application:(UIApplication *)application
continueUserActivity:(NSUserActivity *)userActivity
  restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> *_Nullable))restorationHandler
{
  [RNBranch continueUserActivity:userActivity];

  if ([userActivity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb]) {
    NSURL *url = userActivity.webpageURL;
    if (url != nil) {
      [[DeepLinkManager shared] storeIncomingURL:url.absoluteString];
      return YES;
    }
  }

  return NO;
}

@end
